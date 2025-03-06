import axios from "axios";

const baseURL ='http://localhost:8080';
const instance = axios.create({baseURL})

export async function articleGetAllService() {
    return await instance.get("")
        .then(result =>{
            return result.data;
        }).catch((err) =>{
            console.log(err);
        });
}


export async function articleSearchService(conditions) {
    return await instance.get("",{params:conditions})
        .then(result =>{
            return result.data;
        }).catch((err) =>{
            console.log(err)
        });
}