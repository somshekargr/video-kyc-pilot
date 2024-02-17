import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType, Document } from 'mongoose';

export type VideofloSessionDocument = VideofloSession & Document;

@Schema()
export class VideofloSession {
    @Prop()
    timestamp?: SchemaType.Types.Date;

    @Prop({ type: Object })
    data: any;

    @Prop()
    queueId: number;

    constructor(initialValues?: Partial<VideofloSession>) {
        if (initialValues) Object.assign(this, initialValues);
    }
}

export const VideofloSessionSchema = SchemaFactory.createForClass(VideofloSession);

export const VideofloSessionsCollection = 'Sessions';