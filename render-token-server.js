// index.js
const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const cors = require('cors');

const app = express();
app.use(cors());

// Pour parser les requêtes JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route test
app.get('/', (req, res) => {
    res.send('Serveur de tokens Agora actif');
});

// Route pour générer un token
app.get('/generate-token', (req, res) => {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const channelName = req.query.channel;
    const uid = parseInt(req.query.uid);
    const role = RtcRole.PUBLISHER;
    
    if (!channelName || !uid) {
        return res.status(400).json({ error: 'Channel name et UID requis' });
    }
    
    const expirationTimeInSeconds = 24 * 3600; // 24 heures
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
    try {
        const token = RtcTokenBuilder.buildTokenWithUid(
            appID, 
            appCertificate, 
            channelName, 
            uid, 
            role, 
            privilegeExpiredTs
        );
        
        res.json({ 
            token,
            expires: privilegeExpiredTs,
            channel: channelName,
            uid: uid
        });
    } catch (error) {
        console.error('Erreur génération token:', error);
        res.status(500).json({ error: 'Erreur génération token' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`);
});
