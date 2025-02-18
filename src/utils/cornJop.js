import { CronJob } from "cron";
import couponModel from "../../database/models/coupon.model.js";

const deleteExpiredCoupons = async () => {
  try {
    const result = await couponModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    console.log(`Deleted ${result.deletedCount} expired coupons.`);
  } catch (error) {
    console.error("Error deleting expired coupons:", error);
  }
};

const cronJob = new CronJob(
  "0 0 * * *",
  deleteExpiredCoupons,
  null,
  true,
  "UTC"
);

export default cronJob;
