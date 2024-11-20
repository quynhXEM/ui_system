export async function UploadImage(file: any, title: string, token: string) {
    const folder = title === 'logo' ? '2581b425-459d-415a-bed6-a3fda7733426' : '030e3df4-e5c3-4ccc-896e-ab217e15f94b'
    const myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${token}`);
    const formdata = new FormData();

    formdata.append("folder", folder);
    formdata.append("[]", file);

    const requestOptions: RequestInit = {
        headers: myHeaders,
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    const resault = await fetch("https://soc.socjsc.com/files", requestOptions)
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => console.error(error));

    if (!resault?.data) {
        return { status: false, data: "" }
    }

    
return { status: true, data: resault?.data }
    
}
