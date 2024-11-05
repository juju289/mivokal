const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route de test
app.get('/', (req, res) => {
	res.send('Serveur de tokens Agora actif');
});

// Route pour générer un token
app.get('/generate-token', (req, res) => {
	// Vos identifiants Agora (à remplacer)
	const appID = 'caaf7fcfa25f49c99f00c37a0d149bbc';
	const appCertificate = '79b39c7b15534f2fbc10ad0effd88bd9';
	
	const channelName = req.query.channel;
	const uid = parseInt(req.query.uid);
	const role = RtcRole.PUBLISHER;
	
	if (!channelName || !uid) {
		return res.status(400).json({ error: 'Channel name et UID requis' });
	}
	
	const expirationTimeInSeconds = 24 * 3600;
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

// Démarrage du serveur
app.listen(PORT, () => {
	console.log(`Serveur actif sur le port ${PORT}`);
});