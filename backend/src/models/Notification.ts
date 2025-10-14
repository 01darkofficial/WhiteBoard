import mongoose, { Schema, model } from "mongoose";
import { INOTIFICATION_TYPES, INotification } from "../utils/types";
import { cleanSchema } from "../utils/mongooseClean";

const notificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: INOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    link: String,
    read: { type: Boolean, default: false, index: true },
    relatedInvitation: { type: Schema.Types.ObjectId, ref: "Invitation", },

},
    { timestamps: true }
);
// Virtual
notificationSchema.virtual("timeAgo").get(function (this: INotification) {
    const diffMinutes = Math.floor((Date.now() - this.createdAt.getTime()) / 60000);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
});

// ------------------------
// 🔹 Indexes
// ------------------------
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ relatedInvitation: 1 });

// Optional: TTL for auto-expiring alerts (e.g., 30 days)
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

// ------------------------
// 🔹 Pre-remove cleanup hook (optional)
// ------------------------
notificationSchema.pre<INotification>("deleteOne", async function (next) {
    if (this.relatedInvitation) {
        try {
            await mongoose.model("Invitation").deleteOne({ _id: this.relatedInvitation });
        } catch (err) {
            console.error("Error cleaning up related invitation:", err);
        }
    }
    next();
});

const Notification = model<INotification>("Notification", notificationSchema);

cleanSchema(notificationSchema);

export default Notification;