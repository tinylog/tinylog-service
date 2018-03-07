import 'reflect-metadata';
import { getMetadataArgsStorage } from 'routing-controllers';
import * as swagger from 'swagger-schema-official';
import * as fs from 'fs';
import * as path from 'path';
import * as TJS from 'typescript-json-schema';
import * as glob from 'glob';
import getParamNames from './getParamNames';

/**
 * TODO:
 * 1. 参数类型获取问题
 * 2. query 对象问题
 * 3. 使用 openapi3.0
 */

// 获取 Interface 用
const program = TJS.getProgramFromFiles(
  glob.sync('src/**/*.ts'),
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'tsconfig.json'), { encoding: 'utf8' }))
    .compilerOptions
);

const generator = TJS.buildGenerator(program, { required: true })!;

const storage = getMetadataArgsStorage();

const doc: swagger.Spec & {
  definitions: {
    [definitionsName: string]: swagger.Schema;
  };
} = {
  swagger: '2.0',
  info: {
    title: 'TinyLog API Document',
    description: 'API Document for TinyLog-Service',
    version: '0.1.0'
  },
  host: 'api.example.com',
  basePath: '/v1',
  schemes: ['https'],
  paths: {},
  tags: [] as swagger.Tag[],
  definitions: {}
};

const swaggerParametersMap: { [index: string]: string } = {
  param: 'path',
  queries: 'query',
  body: 'body'
};

doc.tags = storage.controllers.map(c => ({
  name: c.route.substr(1)
}));

storage.actions.forEach(action => {
  const target = Reflect.construct(action.target, []);
  const controller = storage.controllers.find(c => c.target === action.target)!;
  if (action.route instanceof RegExp) {
    throw new Error('TODO RegExp 文档未支持');
  }
  const route = controller.route + action.route.replace(/:(\w+)/g, '{$1}');
  const params = storage.filterParamsWithTargetAndMethod(action.target, action.method);
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, action.method);
  const paramNames = getParamNames(target[action.method]);

  const operation: swagger.Operation = {
    summary: Reflect.getMetadata('summary', target, action.method),
    description: Reflect.getMetadata('design:description', target, action.method),
    tags: [controller.route.substr(1)],
    parameters: [],
    responses: {
      200: {
        description: 'ok'
      }
    }
  };
  params.forEach(param => {
    switch (param.type) {
      case 'param':
        const paramType: string = paramTypes[paramNames.findIndex(name => name === param.name)].name;
        operation.parameters!.push({
          in: 'path',
          name: param.name!,
          required: param.required,
          type: paramType.toLowerCase()
        });
        return;
      case 'queries':
        const queryType = paramTypes[paramNames.findIndex(name => name === swaggerParametersMap[param.type])].name;
        const definitions = generator.getSchemaForSymbol(queryType);
        // tslint:disable-next-line:no-any
        Object.entries(definitions!.properties!).forEach(([key, val]: [string, any]) => {
          operation.parameters!.push({
            in: 'query',
            name: key,
            type: val.type,
            default: val.default
          });
        });
        return;
      case 'body':
        const bodyType = paramTypes[paramNames.findIndex(name => name === (param.name || param.type))].name;
        if (bodyType !== undefined && doc.definitions[bodyType] === undefined) {
          const definition = generator.getSchemaForSymbol(bodyType);
          Reflect.deleteProperty(definition, '$schema');
          doc.definitions[bodyType] = definition as {};
        }
        operation.parameters!.push({
          in: 'body',
          name: 'body',
          schema: {
            $ref: `#/definitions/${bodyType}`
          }
        });
        return;
      default:
        return -1;
    }
  });

  if (doc.paths[route] === undefined) {
    doc.paths[route] = {
      [action.type]: operation
    };
  } else {
    Object.assign(doc.paths[route], {
      [action.type]: operation
    });
  }
});

fs.writeFileSync('doc.json', JSON.stringify(doc, null, 4), { encoding: 'utf-8' });
