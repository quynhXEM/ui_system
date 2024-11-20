export type ProjectItemType = {
  id: string
  name: string
  status: string
  description: string | null
  date_start: string | null
  date_end: string | null
  team_id: string
  team_name?: string
  tasks: string[]
  dependency_project_id: string | null
  user_created: string
  date_created: string
}
