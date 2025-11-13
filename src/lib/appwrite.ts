import { Client, Account } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_API_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

if (!endpoint || !projectId) {
  throw new Error('Missing Appwrite configuration. Please set VITE_APPWRITE_API_ENDPOINT and VITE_APPWRITE_PROJECT_ID')
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)

export const account = new Account(client)
export { client as appwriteClient }
