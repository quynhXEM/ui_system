import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Checkbox
} from '@mui/material';

import { aggregate, readItems } from '@directus/sdk';

import { useDictionary } from '@/contexts/dictionaryContext';
import { TldsItemType } from '@/types/tldsTypes';
import { useDirectus } from '@/contexts/directusProvider';
import TLDSStatusChip from './TLDSStatusChip';
import { getLocalizedUrl } from '@/utils/i18n';
import { Locale } from '@/configs/i18n';

type TLDSTableHeadProps = {
  numSelected: number;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

const TLDSTableHead = ({ onSelectAllClick, numSelected, rowCount }: TLDSTableHeadProps) => {
  const { dictionary } = useDictionary()

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': '',
            }}
          />
        </TableCell>
        <TableCell align="center">{dictionary.name}</TableCell>
        <TableCell align="center">{dictionary.registrar}</TableCell>
        <TableCell align="center">{dictionary.status}</TableCell>
      </TableRow>
    </TableHead>
  );
}

type TLDSTableDataProps = {
  searchText: string
  status: string
}

const TLDSTableData = ({ searchText, status }: TLDSTableDataProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<TldsItemType[]>([])
  const { dictionary } = useDictionary()
  const { directusRequest } = useDirectus()
  const router = useRouter()
  const { lang: locale } = useParams()

  const getData = useCallback(async () => {
    const tldsAPI = await directusRequest(readItems('tlds', {
      fields: ["*", "pricing.*"],
      filter: {
        ...(!!searchText && {
          name: {
            "_contains": searchText
          }
        }),
        ...(status !== 'all_status' && {
          status: {
            "_eq": status
          }
        })
      },
      limit: rowsPerPage,
      page: page + 1, // Begin from 1
    }))

    if (tldsAPI && Array.isArray(tldsAPI)) {
      setRows(tldsAPI)
    }
  }, [directusRequest, searchText, status, rowsPerPage, page])

  const getCountData = useCallback(async () => {
    const count = await directusRequest(aggregate('tlds', {
      aggregate: { count: '*' },
      query: {
        filter: {
          ...(!!searchText && {
            name: {
              "_contains": searchText
            }
          }),
          ...(status !== 'all_status' && {
            status: {
              "_eq": status
            }
          })
        }
      }
    }))

    setTotalRows(count?.[0]?.count ?? 0)
  }, [directusRequest, searchText, status])

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    getCountData()
  }, [getCountData])

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected([...Array(rows.length).keys()]);

      return;
    }

    setSelected([]);
  };

  const handleClick = (event: any, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const onClickRow = (id: string) => {
    router.replace(getLocalizedUrl(`/tlds/${id}`, locale as Locale))
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size='small'
        >
          <TLDSTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={rows.length}
          />
          <TableBody>
            {rows.map((row, index) => {
              const isItemSelected = isSelected(index);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onClickRow(row.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                      onChange={(e) => handleClick(e, index)}
                    />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.registrar}</TableCell>
                  <TableCell>
                    <div className='flex'>
                      <TLDSStatusChip status={row.status} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={dictionary.row_per_page}
      />
    </Paper>
  )
}

export default TLDSTableData
