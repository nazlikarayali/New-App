import type { ComponentDefinition, VariantValues, PropertyValues, StateValues } from './component';
import type React from 'react';

export interface RegisteredComponent extends ComponentDefinition {
  render: (
    variants: VariantValues,
    props: PropertyValues,
    states: StateValues,
    onPropertyChange?: (name: string, value: string | boolean | number) => void
  ) => React.ReactNode;
}

class ComponentRegistryClass {
  private components: Map<string, RegisteredComponent> = new Map();
  private listeners: Set<() => void> = new Set();

  register(component: RegisteredComponent) {
    this.components.set(component.id, component);
    this.listeners.forEach((fn) => fn());
  }

  get(id: string): RegisteredComponent | undefined {
    return this.components.get(id);
  }

  getAll(): RegisteredComponent[] {
    return Array.from(this.components.values());
  }

  getCategories(): Record<string, RegisteredComponent[]> {
    const categories: Record<string, RegisteredComponent[]> = {};
    for (const comp of this.getAll()) {
      const cat = comp.category || 'General';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(comp);
    }
    return categories;
  }

  search(query: string): RegisteredComponent[] {
    const q = query.toLowerCase();
    return this.getAll().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }
}

export const ComponentRegistry = new ComponentRegistryClass();
