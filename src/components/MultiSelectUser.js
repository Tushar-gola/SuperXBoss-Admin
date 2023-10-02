import * as React from 'react';
import { OutlinedInput, FormControlLabel, FormGroup } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { openLoader } from "../actions/index";
import { useDispatch } from "react-redux";
import RetrieveData from "../utils/RetrieveData";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



export default function MultiSelectUser({ userDataId, setUserDataId }) {
    const [userData, setUserData] = React.useState([])

    const dispatch = useDispatch();
    let token = localStorage.getItem("token");
    let brToken = `Bearer ${token}`;
    React.useEffect(() => {
        userDataRetrieve()
    }, [])
    const userDataRetrieve = async () => {
        // dispatch(openLoader(true))
        let {
            data
        } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/customer-retrieve`,
            headers: { Authorization: brToken },
        });
        if (data) {
            setUserData(data);
            // dispatch(openLoader(false))
        }
    };
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setUserDataId(
            value
        );
    };

    const HandleAllUser = async (e) => {
        if (e.target.checked) {
            const arrayOfIds = userData.map((user) => user.id);
            setUserDataId(arrayOfIds);
        } else {
            setUserDataId([])
        }
    }
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">Customer</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={userDataId}
                    onChange={handleChange}
                    input={<OutlinedInput label="Customer" />}
                    renderValue={(selected) => selected.join(', ')}
                // MenuProps={MenuProps}
                >
                    <FormGroup>
                        <FormControlLabel control={<Checkbox onChange={HandleAllUser} />} label="All Customer" sx={{
                            marginLeft: "1.6rem"
                        }} />
                    </FormGroup>
                    {userData.map(({ id, first_name }, index) => {
                        return (
                            <MenuItem key={index} value={id}>
                                <Checkbox checked={userDataId?.includes(id)} />
                                <ListItemText primary={first_name} />
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );
}