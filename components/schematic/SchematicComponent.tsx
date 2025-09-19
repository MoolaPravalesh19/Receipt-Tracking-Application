import { getTemporaryAccessToken } from '@/actions/getTemporaryAccessToken';
import React from 'react'
import SchematicEmbed from './SchematicEmbed';

async function SchematicComponent({componentId}:{ componentId?: string }) {
    if(!componentId){
        return null;
    }
    const accessToken = await getTemporaryAccessToken();
    if (!accessToken) {
        throw new Error('Failed to get access token');
    }
  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
}

export default SchematicComponent;