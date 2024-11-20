import { styled } from '@mui/material/styles'
import { Unstable_NumberInput, type NumberInputProps } from '@mui/base/Unstable_NumberInput';

const NumberInputStyled = styled(Unstable_NumberInput)<NumberInputProps>(({ theme }) => ({
  "&.base-NumberInput-root": {
    transform: 'none',
    width: '100%',
    lineHeight: 1.153,
    position: 'relative',
    marginBottom: theme.spacing(1),
    color: 'var(--mui-palette-text-primary)',
    backgroundColor: 'transparent !important',
    border: `1px solid var(--mui-palette-customColors-inputBorder)`,
    borderRadius: 'var(--mui-shape-borderRadius)',
    height: "2.4rem",
    '&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover': {
      borderColor: 'var(--mui-palette-action-active)'
    },
    '&:before, &:after': {
      display: 'none'
    },
    "& .base-NumberInput-input": {
      maxWidth: '100%',
      lineHeight: 1.153,
      backgroundColor: 'transparent !important',
      color: 'var(--mui-palette-text-primary)',
      height: "100%",
      margin: 0,
      width: "100%",
      padding: '6.25px 13px',
      fontSize: '15px',
    }
  }
}))

const NumberInput = (props: NumberInputProps) => {
  return (
    <NumberInputStyled {...props} />
  )
}

export default NumberInput
