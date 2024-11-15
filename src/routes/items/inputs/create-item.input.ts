import {IsNumber, IsString, Min} from "class-validator";

export class CreateItemInput {
    @IsString()
    name!: string;

    @IsNumber()
    @Min(1)
    weight!: number;
}