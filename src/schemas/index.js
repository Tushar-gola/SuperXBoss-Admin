import * as Yup from 'yup';
export const loginAdmin = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters long").max(25, "Name can be at most 25 characters long").required("Username is required"),
    password: Yup.string().min(2, "Password must be at least 2 characters long").max(25, "Password can be at most 25 characters long").required("Password is required")
});

export const CouponValidate = Yup.object({
    code: Yup.string().required("Code is required"),
    amount: Yup.number().required("Amount is required"),
    min_cart_amt: Yup.number().required("Min Cart amount is required")
});

export const Product = Yup.object({
    name: Yup.string().min(2,"Name must be at least 2 characters long").max(25).required("Please enter your Username"),
    hsn_code: Yup.number().min(8).max(8, "Please Check The Hsn Code").required("Please Check The Hsn Code")
});

export const WalletValidate = Yup.object({
    amount: Yup.number().required("Amount is required"),
    offer_amount: Yup.number().required("Offer Amount is required"),
});
