import "reflect-metadata"
import {
    BaseEntity,
    FindManyOptions,
    FindOneOptions,
    FindOperator,
    FindOptionsSelect,
    FindOptionsWhere,
    OrderByCondition,
} from "typeorm"

import {
    IsDate,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Validate,
} from "class-validator"
import {ClassConstructor, Transform, Type} from "class-transformer"
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder"
import { FindOptionsRelations } from "typeorm/find-options/FindOptionsRelations"

export interface FindConfig<Entity> {
    select?: (keyof Entity)[];
    skip?: number;
    take?: number;
    relations?: string[];
    order?: {
        [K: string]: "ASC" | "DESC";
    };
}


/**
 * Utility type used to remove some optional attributes (coming from K) from a type T
 */
export type WithRequiredProperty<T, K extends keyof T> = T & {
    // -? removes 'optional' from a property
    [Property in K]-?: T[Property]
}

export type PartialPick<T, K extends keyof T> = {
    [P in K]?: T[P]
}

export type Writable<T> = {
    -readonly [key in keyof T]:
    | T[key]
    | FindOperator<T[key]>
    | FindOperator<T[key][]>
    | FindOperator<string[]>
}

export interface FindConfig<Entity> {
    select?: (keyof Entity)[]
    skip?: number
    take?: number
    // page?:number
    relations?: string[]
    order?: { [K: string]: "ASC" | "DESC" }
}

export type ExtendedFindConfig<TEntity> = (
    | Omit<FindOneOptions<TEntity>, "where" | "relations" | "select">
    | Omit<FindManyOptions<TEntity>, "where" | "relations" | "select">
    ) & {
    select?: FindOptionsSelect<TEntity>
    relations?: FindOptionsRelations<TEntity>
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[]
    order?: FindOptionsOrder<TEntity>
    skip?: number
    take?: number
}

export type QuerySelector<TEntity> = Selector<TEntity> & { q?: string }
export type TreeQuerySelector<TEntity> = QuerySelector<TEntity> & {
    include_descendants_tree?: boolean
}

export type Selector<TEntity> = {
    [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    // | DateComparisonOperator
    | StringComparisonOperator
    | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string | string[]>
}



export interface CustomFindOptions<TModel, InKeys extends keyof TModel> {
    select?: FindManyOptions<TModel>["select"]
    where?: FindManyOptions<TModel>["where"] & {
        [P in InKeys]?: TModel[P][]
    }
    order?: OrderByCondition
    skip?: number
    take?: number
}

export type QueryConfig<TEntity extends BaseEntity> = {
    defaultFields?: (keyof TEntity | string)[]
    defaultRelations?: string[]
    allowedFields?: string[]
    allowedRelations?: string[]
    defaultLimit?: number
    isList?: boolean
}

export type RequestQueryFields = {
    expand?: string
    fields?: string
    offset?: number
    limit?: number
    order?: string
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

export type DeleteResponse = {
    id: string
    object: string
    deleted: boolean
}

export class EmptyQueryParams {}



export class StringComparisonOperator {
    @IsString()
    @IsOptional()
    lt?: string

    @IsString()
    @IsOptional()
    gt?: string

    @IsString()
    @IsOptional()
    gte?: string

    @IsString()
    @IsOptional()
    lte?: string

    @IsString()
    @IsOptional()
    contains?: string

    @IsString()
    @IsOptional()
    starts_with?: string

    @IsString()
    @IsOptional()
    ends_with?: string
}

export class NumericalComparisonOperator {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    lt?: number

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    gt?: number

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    gte?: number

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    lte?: number
}


export class FindParams {
    @IsString()
    @IsOptional()
    expand?: string

    @IsString()
    @IsOptional()
    fields?: string
}

export class FindPaginationParams {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    offset?: number = 0

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number = 20
}

export function extendedFindParamsMixin({
                                            limit,
                                            offset,
                                        }: {
    limit?: number
    offset?: number
} = {}): ClassConstructor<FindParams & FindPaginationParams> {
    class FindExtendedPaginationParams extends FindParams {
        @IsNumber()
        @IsOptional()
        @Type(() => Number)
        offset?: number = offset ?? 0

        @IsNumber()
        @IsOptional()
        @Type(() => Number)
        limit?: number = limit ?? 20
    }

    return FindExtendedPaginationParams
}

export * from './pagination-req'