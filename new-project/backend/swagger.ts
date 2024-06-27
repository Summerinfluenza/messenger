import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Messenger Project API',
            description: "API endpoints for a project documented on swagger",
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:5000/",
                description: "Local server"
            }
        ]
    },
    // looks for configuration in specified directories
    apis: ['./src/controllers/*.ts'],  // Adjusted to look for TypeScript files
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number): void {
    // Swagger Page
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // Documentation in JSON format
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log(`Swagger docs available at http://localhost:${port}/api`);
}

export default swaggerDocs;
