import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
// import SearchIcon from '@mui/icons-material/Search';
export default function SearchFeild({ debounceGetData, label, keyId }) {
    return (
        <div>
            <FormControl sx={{ width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-Search" sx={{ fontSize: '1.4rem' }}>{label}</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-Search"
                    size="medium"
                    type='text'
                    onChange={(e) => {
                        debounceGetData({ [keyId]: e.target.value });
                    }}

                    sx={{
                        fontSize: '1.4rem', label: {
                            fontSize: "1.8rem"
                        }
                    }}

                    label={label}
                />
            </FormControl>
        </div>
    )
}
