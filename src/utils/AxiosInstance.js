import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
const AxiosFetchMethod = async (options) => {
    try {
        const { data } = await axios({ ...options })
        if (data.type === "success") { enqueueSnackbar(data.message, { variant: "success" }) }
        if (data.type === "error") {enqueueSnackbar(data.message, { variant: "error" })}
        return data;
    } catch (error) {
        console.log(error, "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
        if (error?.response?.data.errors[0] != null) {
            enqueueSnackbar(error?.response?.data.errors[0].msg, { variant: "error" })
        }
        if (error?.response?.data.errors[0] == null) {
            enqueueSnackbar(error?.response?.data.message, { variant: "error" })
        }
        return error
    }
}
export default AxiosFetchMethod;