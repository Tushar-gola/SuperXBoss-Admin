/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Modal, Button, FormGroup, FormControlLabel } from "@mui/material";
import { useDispatch } from "react-redux";
import { openLoader } from "../../../actions/index";
import Styles from '../../../pages/style.module.css'
import { RetrieveData } from '../../../utils';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import { useSpring, animated } from '@react-spring/web';
import SvgIcon from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import SendIcon from '@mui/icons-material/Send';

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

function TransitionComponent(props) {
    const style = useSpring({
        from: {
            opacity: 0,
            transform: 'translate3d(20px,0,0)',
        },
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
        },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.danger,
    '&.Mui-checked': {
        color: theme.status.danger,
    },
}));

const CustomTreeItem = React.forwardRef((props, ref) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} ref={ref} />
));


export const CatagoriesModal = ({ modalOpen, modalClose }) => {
    const [categoryModalData, setCategoryModalData] = useState()
    const dispatch = useDispatch();
    const CategoryRetrieve = async () => {
        dispatch(openLoader(true));
        let { data } = await RetrieveData({
            method: "get",
            url: `${process.env.REACT_APP_BASE_URL}/api/retrieve/deep-category-retrieve`,
        });
        if (data) {
            dispatch(openLoader(false));
            setCategoryModalData(data)
        }
    }
    useEffect(() => {
        CategoryRetrieve()
    }, [modalOpen])

    const renderTreeItems = (nodes) =>
        nodes && nodes?.map((node) => (
            <CustomTreeItem
                key={node.id}
                nodeId={node.id.toString()}
                label={
                    <div>
                        <FormGroup >
                            <FormControlLabel control={<CustomCheckbox
                                checked={checkedIds.includes(node.id)}
                                onChange={(event) => checkAllParents(node)}
                                size='large' />} label={node.label} sx={{
                                    color: "grey", span: {
                                        fontSize: "1.5rem"
                                    }
                                }} />
                        </FormGroup >
                    </div>
                }
            >
                {Array.isArray(node.children) && node.children.length > 0 && renderTreeItems(node.children)}
            </CustomTreeItem>
        ));

    const [checkedIds, setCheckedIds] = useState([]);

    // const checkAllParents = (node) => {
    //     if (!node) return;
    //     setCheckedIds((prev) => [...prev, node.id]);

    //     checkAllParents(findParent(categoryModalData, node));
    // };


    const checkAllParents = (node) => {
        if (!node) return;
        const nodeId = node.id;
        const isChecked = checkedIds.includes(nodeId);
        if (isChecked) {
            setCheckedIds((prev) => prev.filter((id) => id !== nodeId));
        } else {
            setCheckedIds((prev) => [...prev, nodeId]);
        }
        checkAllParents(findParent(categoryModalData, node));
    };

    const findParent = (tree, targetNode) => {
        for (const node of tree) {
            if (node.children) {
                if (node.children.some((child) => child?.id == targetNode.id)) {
                    return node;
                } else {
                    const parent = findParent(node.children, targetNode);
                    if (parent) {
                        return parent
                    };
                }
            }
        }
        return null;
    };

    console.log([...new Set(checkedIds)])
    console.log(checkedIds, "checkedIds");


    return (
        <>
            <Modal
                open={modalOpen}
                onClose={modalClose}
                tabIndex={0}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="modal">
                <Box className={Styles.style3} sx={{ padding: "2rem", position: "relative" }}>
                    <div className="modal_title">
                        <h2>Create Category Modal</h2>
                    </div>
                    <hr />

                    <TreeView
                        aria-label="customized"
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        defaultEndIcon={<CloseSquare />}
                        sx={{ height: 704, flexGrow: 1, width: "100%", overflow: 'hidden' }}
                    >
                        {renderTreeItems(categoryModalData)}
                    </TreeView>
                    <div
                        className="modal_btn"
                        style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "flex-end",
                            position: "sticky",
                            bottom: 0

                        }}
                    >

                        <Button
                            variant="outlined"
                            sx={{
                                border: "2px solid #1B4B66",
                                '&:hover': {
                                    border: "2px solid #1B4B66",
                                }
                            }}
                            onClick={modalClose}
                            className="btn_main2"
                        >
                            Close
                        </Button>
                        <Button variant="contained" className="btn_main" type="submit" endIcon={<SendIcon />}>
                            Submit
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}
