
export type TeamType = {
    id: String,
    status: String,
    name: String,
    icon: String,
    logo: string,
    sort: string | null,
    date_created: string | Date | any,
    date_updated: string | Date | any,
    user_updated: string | null,
    user_created: string,
    members: Array<number>
}

export type ProjectType = {
    id: string,
    name: string,
    description: string | null,
    status : string | null,
    team: TeamType,
    sort: string | null,
    date_created: string | Date | any,
    date_updated: string | Date | any,
    user_updated: string | null,
    user_created: string,
}


export type FileUpdloadType = {
    id: string;
    storage: string;
    filename_disk: string;
    filename_download: string;
    title: string;
    type: string;
    folder: string;
    uploaded_by: string;
    created_on: string; 
    modified_by: string | null;
    modified_on: string;
    charset: string | null;
    filesize: string;
    width: number;
    height: number;
    duration: number | null;
    embed: string | null;
    description: string | null;
    location: string | null;
    tags: string | null;
    metadata: Record<string, any>;
    focal_point_x: number | null;
    focal_point_y: number | null;
    tus_id: string | null;
    tus_data: string | null;
    uploaded_on: string; 
}
