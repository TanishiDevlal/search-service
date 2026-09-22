import express from 'express';
import FleetController from '../controllers/fleet.controller.js';

const router = express.Router();
const fleetController = new FleetController();

// Sanity check
router.get('/ping', (req, res) => res.json({ message: 'search-service fleet route active' }));

// ─── Clean RESTful Endpoints ────────────────────────────────
router.get('/', fleetController.getFleets.bind(fleetController));
router.get('/dimensions', fleetController.getDimensions.bind(fleetController));
router.get('/machines/:id', fleetController.getMachineDetail.bind(fleetController));
router.get('/categories/:id', fleetController.getMachineDetailv1.bind(fleetController));
router.get('/dimensions/:id/price', fleetController.getDimensionPrice.bind(fleetController));
router.post('/search', fleetController.createSearchModel.bind(fleetController));

// ─── Legacy 1:1 Parity Endpoints (Handbook Day 2) ───────────
router.get('/getFleets', fleetController.getFleets.bind(fleetController));
router.get('/get/all/dimensions', fleetController.getDimensions.bind(fleetController));
router.get('/get-machine-detail/:id', fleetController.getMachineDetail.bind(fleetController));
router.get('/v1/get-machine-detail/:id', fleetController.getMachineDetailv1.bind(fleetController));
router.get('/get/dimension/price/:id', fleetController.getDimensionPrice.bind(fleetController));
router.post('/createSeachModel', fleetController.createSearchModel.bind(fleetController));

export default router;