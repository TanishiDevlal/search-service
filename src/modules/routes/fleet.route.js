import express from 'express';
import FleetController from '../controllers/fleet.controller.js';

const router = express.Router();
const fleetController = new FleetController();

router.get('/ping', (req, res) => res.json({ message: 'search-service fleet route active' }));

router.get('/allFleets', fleetController.getFleets.bind(fleetController));
router.get('/dimensions', fleetController.getDimensions.bind(fleetController));
router.get('/machine/:id', fleetController.getMachineDetail.bind(fleetController));
router.get('/category/:machineType', fleetController.getCategoryDetail.bind(fleetController));

router.get('/searchMachines', fleetController.searchMachines.bind(fleetController));

export default router;