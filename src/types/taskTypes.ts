export type TaskItemType = {
  id: string
  sort?: number | null
  date_created?: string
  user_created?: string
  date_updated?: string
  user_updated?: string
  status?: string
  name: string
  content?: string
  date_closed?: string | null
  project_id?: string
  project_name?: string
  date_start?: string
  date_end?: string
  dependency_task_id?: string | null
  assigner_id?: string
  assignee_id?: string
  approver_id?: string
  duration_estimated?: string | null
  duration_actual?: string | null
  salary_amount?: number | null
  role?: string | undefined | null
  time_logs?: Array<any>
  discussions? : Array<any>
}
