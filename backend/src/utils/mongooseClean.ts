import { Schema, Document } from "mongoose";

/**
 * Adds consistent toObject and toJSON transformations
 * to clean Mongoose documents before sending to clients.
 *
 * @param schema - Mongoose schema to apply transformations on
 */
export const cleanSchema = <T extends Document>(schema: Schema<T>) => {
    const transform = (_doc: any, ret: any) => {
        if (ret._id) {
            ret.id = (ret._id as string).toString(); // <-- type assertion fixes the error
            delete ret._id;
        }
        delete ret.__v;
        return ret;
    };

    schema.set("toObject", { virtuals: true, transform });
    schema.set("toJSON", { virtuals: true, transform });
};
