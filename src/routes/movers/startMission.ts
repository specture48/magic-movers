import mongoose from "mongoose";
import MagicMover from "../../models/mover";
import ActivityLog from "../../models/activity-log";

export const startMission = async (req, res) => {
    const { id:moverId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the mover by ID
        const mover = await MagicMover.findById(moverId).session(session);
        if (!mover) {
            return res.status(404).json({ message: "Mover not found" });
        }

        // Validate the current state
        if (mover.questState === "on-mission") {
            return res.status(400).json({ message: "Mover is already on a mission" });
        }

        if (mover.questState !== "loading") {
            return res.status(400).json({
                message: "Mover must be in 'loading' state to start a mission",
            });
        }

        // Update the mover's state to 'on-mission'
        mover.questState = "on-mission";
        await mover.save({ session });

        // Log the transition
        const logEntry = new ActivityLog({
            mover,
            action: "on-mission",
            timestamp: new Date(),
        });
        await logEntry.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();

        return res.status(200).json({ message: "Mission started successfully", mover });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        console.error("Error starting mission:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
