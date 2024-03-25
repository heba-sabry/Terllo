import mongoose from "mongoose";
const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log(`DB Connected`);
      // console.log(result);
    })
    .catch((err) => {
      console.log(`Fail to connect DB ......${err}`);
    });
};
export default connectionDB;
