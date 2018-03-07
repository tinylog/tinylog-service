import 'reflect-metadata';

export function Description(desc: string) {
  return (target: Object, propertyName: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('design:description', desc, target, propertyName);
  };
}
