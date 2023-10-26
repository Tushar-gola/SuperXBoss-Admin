import {$crud} from '../utils/CrudFactory'
// import axios from "axios";
import _ from "lodash";

function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

export function stringAvatar(name) {
    const newName = name.replace(/\s+/g, " ").trim();
    return {
        sx: {
            bgcolor: stringToColor(newName),
        },
        children: newName.split(" ").length > 1 ? `${newName.split(" ")[0][0]?.toUpperCase()}${newName.split(" ")[1][0]?.toUpperCase()}` : `${newName.split(" ")[0].trim()[0]?.toUpperCase()}`
    };
}

export const retrieveData = async (url, params = {}) => {
    const {data} = await $crud.retrieve(url, params)
    return data
}

export const create = async (url, data = {}, options = {}) => {
    const {data: response} = await $crud.create(url, data, options);
    return response;
}

export const update = async (url, data = {}) => {
    const {data: response} = await $crud.update(url, data);
    return response;
}

export const isAppendRow = (setRows, row) => {
    setRows(prev => {
        const data = [...prev];
        if (data.find(d => d.id === row.id)) {
            return data.map((d, index) => {
                if (d.id === row.id) {
                    d = _.cloneDeep(row)
                    return d
                } else {
                    return d
                }
            })
        } else {
            return [row, ...data]
        }
    })
}

// export const get_Pincode = async (pincode) => {
//     const {data: [{Message, PostOffice, Status}]} = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
//     if (Status === "Error") return {Status, Message: "Invalid Pincode"}
//     else if (Status === "Success") return {
//         Status,
//         Message,
//         data: {
//             Country: PostOffice[0]?.Country,
//             State: PostOffice[0]?.State,
//             District: PostOffice[0]?.District
//         }
//     }
// }