import {IsNumber, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class GetPaginationParams {
    @IsOptional()
    @Transform(o=>Number(o.value))
    offset?: number=0

    @IsOptional()
    @Transform(o=>Number(o.value))
    limit?: number=100
    // order?: string;
}