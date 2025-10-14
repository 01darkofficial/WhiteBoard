
import { Response } from "express";
import { AuthRequest } from "../utils/types";
import Notification from "../models/Notification";
import { respondToInvitation } from "./invitationController";

export const createNotification = async (
    userId: string,
    type: string,
    title: string,
    message: string,
    link?: string,
    relatedInvitation?: string,
) => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            link,
            relatedInvitation
        })

        await notification.save();

        return notification;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { limit = 20, unreadOnly } = req.query;

        const query: any = { userId };
        if (unreadOnly === 'true') query.read = false;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit));

        res.status(200).json(notifications);
        console.log(`Fetched ${notifications.length} notifications for user ${userId}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

export const markRead = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { notificationId } = req.params;

        const notfication = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );

        if (!notfication) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.status(200).json(notfication);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
}

export const markAllRead = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const result = await Notification.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );

        console.log(`${result.modifiedCount} notifications marked as read`);
        res.status(200).json({ message: "Notifications marked as read" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
}

export const respondToNotification = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { notificationId } = req.params;
        const { response, userEmail } = req.body;

        console.log(notificationId)

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        if (notification.userId.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized user" });
        }

        if (!notification.relatedInvitation) {
            return res.status(404).json({ error: 'No related invitation found' });
        }

        const invitationResponse = await respondToInvitation(
            notification.relatedInvitation._id.toString(),
            userId.toString(),
            response,
            userEmail
        );

        if (!invitationResponse) {
            return res.status(500).json({ error: 'Some error happened' });
        }

        // Update notification
        notification.read = true;
        notification.type = 'alert';
        notification.title = `Invitation ${response == 'accept' ? 'accepted' : 'declined'}`;
        notification.message = `You've ${response === 'accept' ? 'accepted' : 'declined'} the invitation`;
        await notification.save();

        res.status(200).json({
            message: `Invitation ${response === 'accept' ? 'accepted' : 'declined'}`,
            notification,
            invitation: invitationResponse
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to to process notification' });
    }
}