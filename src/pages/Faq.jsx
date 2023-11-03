/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Box, Grid, Button, Switch, FormControlLabel } from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { AxiosFetchMethod, RetrieveData } from "../utils";
import MuiAccordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { openLoader } from "../actions/index";
import { styled } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { isAppendRow } from '../functions';

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        // backgroundColor:"",
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 18,
            height: 18,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="red" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="17" width="17" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        backgroundColor: '#1B4B66',
        width: 16,
        height: 16,
        margin: 2,
    },
}));

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));
export const Faq = () => {
    const [expanded, setExpanded] = React.useState('panel1');
    const [editFaq, setEditFaq] = useState()
    const [faq, setFaq] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setValues({ id: editFaq?.id, question: editFaq?.question, answer: editFaq?.answer })
    }, [editFaq])

    useEffect(() => {
        FaqRetrieve()
    }, [])


    const { handleBlur, handleSubmit, handleChange, values, setValues } =
        useFormik({
            initialValues: {
                question: "",
                answer: "",
            },
            onSubmit: async (val̥ues) => {
                let AxiosFetch;
                dispatch(openLoader(true));
                if (editFaq) {
                    AxiosFetch = await AxiosFetchMethod({
                        url: `${process.env.REACT_APP_BASE_URL}/api/update/faqs-update`,
                        method: "put",
                        data: values,
                    }); setEditFaq(null)
                } else {
                    AxiosFetch = await AxiosFetchMethod({
                        url: `${process.env.REACT_APP_BASE_URL}/api/create/faqs-create`,
                        method: "post",
                        data: values,
                    });
                }
                if (AxiosFetch?.type === "error" || AxiosFetch?.response?.data.type === "error") {
                    dispatch(openLoader(false));
                } else {
                    if (AxiosFetch.type === "success") {
                        dispatch(openLoader(false));
                        isAppendRow(setFaq, AxiosFetch.data)
                        values.question = ""
                        values.answer = ""
                    }
                }
            },
        });

    const handleChanges = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const FaqRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/faqs-retrieve`,
        });
        if (data) {
            setFaq(data)
            dispatch(openLoader(false));
        }
    }

    const handleSwitch = async (id, status) => {
        dispatch(openLoader(true));
        let data = await AxiosFetchMethod({
            url: `${process.env.REACT_APP_BASE_URL}/api/update/faqs-update`,
            method: "put",
            data: { id: id, status: status },
        });
        if (data) {
            dispatch(openLoader(false));
            isAppendRow(setFaq, data.data)
        }
    };

    return (
        <>
            <Box sx={{ width: "60%", margin: "auto", marginTop: "4rem" }}>
                <form className='catagories_form'
                    onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <label htmlFor="Question">Question</label>
                            <input
                                type="text"
                                name="question"
                                id="Question"
                                required
                                placeholder="Question"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.question || ''} />
                        </Grid>

                        <Grid item xs={5}>
                            <label htmlFor="Answer">Answer</label>
                            <input
                                type="text"
                                name="answer"
                                id="Answer"
                                required
                                placeholder="Answer"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.answer || ''} />

                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" className="btn_main" sx={{ marginTop: "2.5rem", marginLeft: "1rem" }} type="submit" endIcon={<SendIcon />}></Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>




            <Box sx={{ padding: "0 3rem" }}>
                {
                    faq && faq.map((item, index) => {
                        return (
                            <Accordion expanded={expanded === `panel${index}`} onChange={handleChanges(`panel${index}`)} key={index}
                                sx={{ backgroundColor: !item?.status && "#1b4b6660" }}
                            >
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" className="accordion-faq">
                                    <Typography sx={{ fontSize: "1.9rem" }}><span>Ques:{item?.id}</span>   {item?.question}</Typography>
                                    <div className='faq-tool'>
                                        <div className='coupon-edit' onClick={() => setEditFaq(item)} >
                                            <ModeEditOutlineIcon sx={{ color: "#1B4B66", fontSize: "2.5rem" }} /> <span>Edit</span>
                                        </div>
                                        <FormControlLabel
                                            control={<Android12Switch checked={item?.status} size="large" onClick={() => handleSwitch(item?.id, item?.status)} />}
                                            label="Status" sx={{
                                                color: "#000", span: {
                                                    fontSize: "1.5rem"
                                                }
                                            }}
                                        />
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails >
                                    <Typography sx={{ textAlign: "start", fontSize: "1.8rem", color: item?.status ? "grey" : "white" }}>
                                        {item?.answer}
                                    </Typography>
                                </AccordionDetails>

                            </Accordion>
                        )
                    })}
            </Box >

        </>
    )
}
