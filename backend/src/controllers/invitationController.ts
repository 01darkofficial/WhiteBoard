import { Types } from "mongoose";
import Invitation from "../models/Invitation";
import { createNotification } from "./notificationController";
import Board from "../models/Board";

export const sendInvitation = async (
    boardId: string,
    userId: string,
    inviteeId: string,
    role: string,
    permissions: string[],
    userEmail: string,
    inviteeEmail: string,
    boardName: string,
) => {

    try {
        // Create invitation
        const invitation = new Invitation({
            board: boardId,
            invitee: inviteeId,
            inviter: userId,
            role: role,
            boardPermissions: permissions,
        })

        await invitation.save();
        console.log('Invitation created:', invitation);

        const inviteNotification = createNotification(
            inviteeId.toString(),
            "invite",
            "Board Invitation",
            `You have been invited by ${userEmail} to join ${boardName} board`,
            "",
            invitation.id,
        )

        const successInviteNotification = createNotification(
            userId.toString(),
            "notify",
            "Success",
            `Invitation sent successfully to ${inviteeEmail} to join bard ${boardName}`,
            "",
            invitation.id
        );

        return { invitation, inviteNotification, successInviteNotification };

    }
    catch (err) {
        console.error(err);
        return null;
    }
}

export const respondToInvitation = async (invitationId: string, userId: string, response: string, userEmail: string) => {
    try {

        const invitation = await Invitation.findById(invitationId);

        if (userId !== invitation?.invitee.toString()) {
            console.error("Not authorized invitee");
            return null;
        }
        if (!invitation) {
            console.error("Invitation not found");
            return null;
        }

        invitation.status = response === 'accept' ? 'accepted' : 'rejected';
        await invitation.save();
        const board = await Board.findById(invitation.board);
        if (!board) {
            return null;
        }
        if (board.members.length >= board.maxMembers) {
            return null;
        }
        board.members.push(
            {
                user: new Types.ObjectId(userId),
                role: invitation.role,
                permissions: invitation.boardPermissions
            }
        );

        console.log("hello", board);

        await board.save();

        const notifyInviter = createNotification(
            invitation.inviter.toString(),
            "notify",
            "Invitation accepted",
            `${userEmail} has accepted your invitation for ${board.name} board`,
        )
        if (!notifyInviter) return null;

        return invitation;
    }
    catch (error) {
        console.error(error);
        null
    }
}
