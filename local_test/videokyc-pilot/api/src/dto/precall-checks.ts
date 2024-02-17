import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export abstract class ChecklistItemBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  subTitle?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  body?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  footer?: string;
}

export abstract class CheckListItemWithContinueButtonTextBase extends ChecklistItemBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  continueButtonText?: string = 'Continue';
}

export class CallConsent extends CheckListItemWithContinueButtonTextBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  checkboxText: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  validationErrorText?: string = 'You need to agree to the terms before you can continue.';
}

export class DevicePermissionsChecklist extends ChecklistItemBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  subTitle?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  body?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  geolocation?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  ipAddress?: boolean;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  camera: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  microphone: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  footer?: string;


  @ApiProperty({ required: false })
  @Prop({ required: false })
  cameraNotFoundText?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  continueButtonText?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  microphoneNotFoundText?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  rearCameraNotFoundText?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  rearCamera?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  isRearCameraMandatory?: boolean;
}

export class PrecallChecklist extends CheckListItemWithContinueButtonTextBase {
  @ApiProperty({ type: [String], required: false })
  @Prop({ required: false })
  items?: string[];
}

export class PrecallChecks {
  @ApiProperty()
  @Prop()
  consent: CallConsent;

  @ApiProperty()
  @Prop()
  devicePermissions: DevicePermissionsChecklist;

  @ApiProperty({ type: [PrecallChecklist], required: false })
  @Prop({ type: [PrecallChecklist], required: false })
  checklist?: PrecallChecklist[];
}
