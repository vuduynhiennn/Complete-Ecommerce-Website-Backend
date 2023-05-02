const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

const { notFound, errorHandler } = require("./middlewares/errorHandle");

const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const blogRouter = require("./routes/blog.routes");
const blog_categoryRouter = require("./routes/blog_category.routes");
const prod_categoryRouter = require("./routes/prod_category.routes");
const brandRouter = require("./routes/brand.routes");
const couponRouter = require("./routes/coupon.routes");
const colorRouter = require("./routes/color.routes");
const enqRouter = require("./routes/enq.routes");

const dbConnect = require("./config/dbConnect");
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/pcategory', prod_categoryRouter);
app.use('/api/bcategory', blog_categoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/color', colorRouter);
app.use('/api/enquiry', enqRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);  
});
