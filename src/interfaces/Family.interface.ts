export interface FamilyInterface<Module> {
  id: string;

  parentId: string | null;

  parent?: FamilyInterface<Module> | null;

  children?: FamilyInterface<Module>[];
}