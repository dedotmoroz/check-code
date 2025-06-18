# check-code


TS2322: Type
(response: Entities.INotesList) => EntityState<Entities.INoteListItem, string> & {     total: number;     limit: number;     offset: number; }
is not assignable to type
(baseQueryReturnValue: unknown, meta: FetchBaseQueryMeta | undefined, arg: INotesListPage) => INoteList | Promise<INoteList>
Type
EntityState<INoteListItem, string> & {     total: number;     limit: number;     offset: number; }
is not assignable to type INoteList | Promise<INoteList>
Type
EntityState<INoteListItem, string> & {     total: number;     limit: number;     offset: number; }
is not assignable to type INoteList
Types of property entities are incompatible.
Type
Record<string, import("/Users/17230829/Documents/DELTA_3/web-isu-top/src/shared/api/notes/entities").INoteListItem>
is not assignable to type
Record<string, import("/Users/17230829/Documents/DELTA_3/web-isu-top/src/shared/api/notes/dtos").INoteListItem>
endpointDefinitions.d.ts(53, 5): The expected type comes from property transformResponse which is declared here on type
Omit<EndpointDefinitionWithQuery<INotesListPage, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, INoteList> & { ...; } & { ...; } & QueryExtraOptions<...>, "type"> | Omit<...>
