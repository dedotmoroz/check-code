# check-code


TS2769: No overload matches this call.
Overload 1 of 2, '(state: DraftableEntityState<{ id: string; name: string; parentId?: string | undefined; }[], EntityId>, entities: readonly { id: string; name: string; parentId?: string | undefined; }[][] | Record<...>): DraftableEntityState<...>', gave the following error.
Argument of type MaybeDrafted<IFoldersList> is not assignable to parameter of type
DraftableEntityState<{     id: string;     name: string;     parentId?: string | undefined; }[], EntityId>
Type IFoldersList is not assignable to type
DraftableEntityState<{     id: string;     name: string;     parentId?: string | undefined; }[], EntityId>
Type IFoldersList is not assignable to type
WritableDraft<EntityState<{     id: string;     name: string;     parentId?: string | undefined; }[], EntityId>>
Types of property entities are incompatible.
Type 'Record<string, { id: string; name: string; parentId?: string | undefined; }>' is not assignable to type 'WritableDraft<Record<EntityId, { id: string; name: string; parentId?: string | undefined; }[]>>'.
string index signatures are incompatible.
Type
{     id: string;     name: string;     parentId?: string | undefined; }
is missing the following properties from type
WritableDraft<{     id: string;     name: string;     parentId?: string | undefined; }>[]
: length, pop, push, concat, and 29 more.
Overload 2 of 2, '(state: DraftableEntityState<{ id: string; name: string; parentId?: string | undefined; }[], EntityId>, entities: { payload: readonly { id: string; name: string; parentId?: string | undefined; }[][] | Record<...>; type: string; }): DraftableEntityState<...>', gave the following error.
Argument of type MaybeDrafted<IFoldersList> is not assignable to parameter of type
DraftableEntityState<{     id: string;     name: string;     parentId?: string | undefined; }[], EntityId>
