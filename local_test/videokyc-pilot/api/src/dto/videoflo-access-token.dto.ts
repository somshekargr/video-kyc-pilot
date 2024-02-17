import { ApiProperty } from "@nestjs/swagger";

export class VideoFloAccessTokenDTO {
    @ApiProperty()
    accessToken: string;

    constructor(initialValues?: Partial<VideoFloAccessTokenDTO>) {

        if (initialValues) Object.assign(this, initialValues);
    }
}
