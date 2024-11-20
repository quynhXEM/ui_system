export type TaskType = {
  id: string
  sort: number | null
  date_created: string
  user_created: string | any
  date_updated: string
  user_updated: string | any
  status: string
  name: string
  content: string
  date_closed: string | null
  project_id: string | any
  date_start: string
  date_end: string
  dependency_task_id: string | null
  assigner_id: string | any
  assignee_id: string | any
  approver_id: string | any
  duration_estimated: number | null
  duration_actual: number | null
  salary_amount: number | null
  role?: string | undefined | null
  time_logs?: Array<any>
  discussions?: Array<any>
}
