import { helloWorld } from './function';
import { http } from '@google-cloud/functions-framework';

// Register the HTTP function
http('helloWorld', helloWorld);