/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Select, FormControl, InputLabel, OutlinedInput, MenuItem } from '@mui/material';
import { RetrieveData } from '../utils';
export const SelectSearch = ({ debounceGetData, sparePart, segment, label, KeyId, statusCheck }) => {
    const [data, setData] = React.useState([])
    React.useEffect(() => {
        sparePart && sparePartBrand();
        segment && vehicleSegment();
    }, [])

    const sparePartBrand = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/all-brand-for-model`,
        });
        setData(data)
    }

    const vehicleSegment = async () => {
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/vehicle-segment-type`,
        });
        setData(data)
    }
    const status = [
        {
            id: '1', label: "Active"
        },
        {
            id: '0', label: "Pending"
        }
    ]

    return (
        <FormControl sx={{ width: '100%' }}>
            <InputLabel htmlFor="custom-select" sx={{ fontSize: '1.4rem' }}>{label}</InputLabel>

            <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                // value={personName}
                onChange={(e) => debounceGetData({ [KeyId]: e.target.value })}
                sx={{
                    fontSize: '1.4rem', label: {
                        fontSize: "1.8rem"
                    }
                }}
                input={<OutlinedInput label={label} />}
            // MenuProps={MenuProps}
            >

                <MenuItem sx={{ fontSize: '1.4rem' }}>
                    <em>------Select---------</em>
                </MenuItem>
                {!statusCheck ? data && data?.map((res, index) => {
                    return (
                        <MenuItem key={index} value={res.id || ''} sx={{ fontSize: '1.4rem' }} >
                            {res.name}
                        </MenuItem>
                    )
                }) :

                    status && status?.map((res, index) => {
                        console.log();
                        return (
                            <MenuItem key={index} value={res.id || ''} sx={{ fontSize: '1.4rem' }} >
                                {res.label}
                            </MenuItem>
                        )
                    })


                }



            </Select>
        </FormControl >
    )
}
