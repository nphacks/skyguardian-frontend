import { Component, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { LineString, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import Circle from 'ol/geom/Circle';

interface FlightRoute {
  id: string;
  coordinates: number[][];
}

export const FLIGHT_ROUTES: FlightRoute[] = [
  {
    id: 'coastal_route',
    coordinates: [
      fromLonLat([-122.4194, 37.7749]), // San Francisco
      fromLonLat([-122.3321, 37.5483]), // San Mateo
      fromLonLat([-122.0819, 37.3541]), // Mountain View
      fromLonLat([-121.9552, 36.9741]), // Santa Cruz
      fromLonLat([-121.8947, 36.6002]), // Monterey
      fromLonLat([-120.6596, 35.2828]), // San Luis Obispo
      fromLonLat([-119.8871, 34.4208]), // Santa Barbara
      fromLonLat([-119.2426, 34.2805]), // Oxnard
      fromLonLat([-118.7798, 34.0505]), // Santa Monica
      fromLonLat([-118.2437, 34.0522]), // Los Angeles
    ]
  },
  {
    id: 'central_valley_route',
    coordinates: [
      fromLonLat([-122.4194, 37.7749]), // San Francisco
      fromLonLat([-121.4944, 37.4419]), // Tracy
      fromLonLat([-120.9969, 37.6213]), // Modesto
      fromLonLat([-120.4829, 37.3021]), // Merced
      fromLonLat([-119.7871, 36.7378]), // Fresno
      fromLonLat([-119.3157, 36.3302]), // Visalia
      fromLonLat([-119.0187, 35.3733]), // Bakersfield
      fromLonLat([-118.8597, 34.8233]), // Lancaster
      fromLonLat([-118.4412, 34.2164]), // San Fernando
      fromLonLat([-118.2437, 34.0522]), // Los Angeles
    ]
  },
  {
    id: 'eastern_route',
    coordinates: [
      fromLonLat([-122.4194, 37.7749]), // San Francisco
      fromLonLat([-121.2908, 37.9577]), // Stockton
      fromLonLat([-120.9969, 37.6213]), // Modesto (shared with central_valley)
      fromLonLat([-120.0324, 36.9782]), // Madera
      fromLonLat([-119.7871, 36.7378]), // Fresno (shared with central_valley)
      fromLonLat([-118.9859, 35.9957]), // Tehachapi
      fromLonLat([-118.8597, 34.8233]), // Lancaster (shared with central_valley)
      fromLonLat([-118.4412, 34.2164]), // San Fernando (shared with central_valley)
      fromLonLat([-118.3884, 34.1478]), // Glendale
      fromLonLat([-118.2437, 34.0522]), // Los Angeles
    ]
  },
  {
    id: 'hybrid_route',
    coordinates: [
      fromLonLat([-122.4194, 37.7749]), // San Francisco
      fromLonLat([-122.0819, 37.3541]), // Mountain View (shared with coastal)
      fromLonLat([-121.4944, 37.4419]), // Tracy (shared with central_valley)
      fromLonLat([-120.4829, 37.3021]), // Merced (shared with central_valley)
      fromLonLat([-120.0324, 36.9782]), // Madera (shared with eastern)
      fromLonLat([-119.3157, 36.3302]), // Visalia (shared with central_valley)
      fromLonLat([-119.0187, 35.3733]), // Bakersfield (shared with central_valley)
      fromLonLat([-118.9859, 35.9957]), // Tehachapi (shared with eastern)
      fromLonLat([-118.7798, 34.0505]), // Santa Monica (shared with coastal)
      fromLonLat([-118.2437, 34.0522]), // Los Angeles
    ]
  }
];

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  map: Map | undefined;
  private currentInterval: any;
  availableRoutes: FlightRoute[] = FLIGHT_ROUTES;
  activeRoute: FlightRoute = FLIGHT_ROUTES[0]; 
  flightPathCoordinates: number[][] = this.activeRoute.coordinates;
  currentPositionIndex: number = 0;
  flightFeature: Feature | undefined;
  vectorLayer: VectorLayer<VectorSource> | undefined;
  flightMarkerLayer: VectorLayer<VectorSource> | undefined;
  availableColors = ['blue', 'green', 'orange', 'purple'];
  routeLayers: { [key: string]: VectorLayer<VectorSource> } = {};

    isMapVisible = false;
  
  startFlightSimulation(): void {
    this.isMapVisible = true;
    setTimeout(() => {
      this.initializeMap();
      this.createRouteButtons();
      this.startFlight();
    }, 100);
  }
  

  startFlight(): void {
    this.currentPositionIndex = 0;
    if (this.flightFeature) {
      this.flightFeature.setGeometry(new Point(this.flightPathCoordinates[0]));
    }
    this.animateFlight();
  }
  
  ngAfterViewInit(): void {
    this.initializeMap();
    this.createRouteButtons();
  }
  

  initializeMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: this.flightPathCoordinates[0], 
        zoom: 7,
      }),
    });

    // Add flight path
    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [new Feature(new LineString(this.flightPathCoordinates))],
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3,
        }),
      }),
    });
    this.map.addLayer(this.vectorLayer);

    // Add flight marker
    this.flightFeature = new Feature({
      geometry: new Point(this.flightPathCoordinates[0]),
    });
    this.flightMarkerLayer = new VectorLayer({
      source: new VectorSource({
        features: [this.flightFeature],
      }),
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: 'red' }),
        }),
      }),
    });
    this.map.addLayer(this.flightMarkerLayer);
  }

  switchRoute(routeId: string) {
    const newRoute = this.availableRoutes.find(route => route.id === routeId);
    if (newRoute && this.map) {
      this.activeRoute = newRoute;
      this.flightPathCoordinates = newRoute.coordinates;
      this.currentPositionIndex = 0;

      Object.entries(this.routeLayers).forEach(([id, layer]) => {
        layer.setStyle(new Style({
          stroke: new Stroke({
            color: id === routeId ? 'blue' : '#999999',
            width: id === routeId ? 3 : 1,
          })
        }));
      });

      if (this.flightFeature) {
        this.flightFeature.setGeometry(new Point(this.flightPathCoordinates[0]));
      }

      this.animateFlight();
    }
}

  showAllRoutes(): void {
    Object.values(this.routeLayers).forEach(layer => {
        this.map?.removeLayer(layer);
    });
    this.routeLayers = {};

    this.availableRoutes.forEach((route, index) => {
        const color = this.availableColors[index % this.availableColors.length];
        const routeLayer = new VectorLayer({
            source: new VectorSource({
                features: [new Feature(new LineString(route.coordinates))],
            }),
            style: new Style({
                stroke: new Stroke({
                    color: color,
                    width: 2,
                }),
            }),
        });
        this.routeLayers[route.id] = routeLayer;
        this.map?.addLayer(routeLayer);
    });
  }

  findAlternativeRoute(noFlyZoneCenter: number[], radius: number): FlightRoute | undefined {
    return this.availableRoutes.find(route => 
      !this.routeIntersectsNoFlyZone(route, noFlyZoneCenter, radius)
    );
  }

  private routeIntersectsNoFlyZone(route: FlightRoute, center: number[], radius: number): boolean {
    for (let i = 0; i < route.coordinates.length - 1; i++) {
      const point1 = route.coordinates[i];
      const point2 = route.coordinates[i + 1];
      
      if (this.isPointInCircle(point1, center, radius) || 
          this.isPointInCircle(point2, center, radius)) {
        return true;
      }
    }
    return false;
  }

  createRouteButtons(): void {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.zIndex = '1';

    this.availableRoutes.forEach((route, index) => {
        const button = document.createElement('button');
        button.innerHTML = `Switch to ${route.id.replace('_', ' ')}`;
        button.style.backgroundColor = this.availableColors[index % this.availableColors.length];
        button.style.color = 'white';
        button.style.margin = '5px';
        button.style.padding = '8px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', () => {
            this.switchRoute(route.id);
        });
        
        buttonContainer.appendChild(button);
    });

    document.getElementById('map-button-container')?.appendChild(buttonContainer);
  }

  private isPointInCircle(point: number[], center: number[], radius: number): boolean {
    const dx = point[0] - center[0];
    const dy = point[1] - center[1];
    return (dx * dx + dy * dy) <= radius * radius;
  }

  addNoFlyZone(): void {
    const noFlyZoneCoordinates = fromLonLat([-121.8947, 36.6002]); 
    const radius = 50000; 
    const noFlyZone = new Feature({
      geometry: new Circle(noFlyZoneCoordinates, radius),
    });
  
    const noFlyZoneLayer = new VectorLayer({
      source: new VectorSource({
        features: [noFlyZone],
      }),
      style: new Style({
        fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }),
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
      }),
    });
  
    this.map?.addLayer(noFlyZoneLayer);

    this.showAllRoutes();
  }

  private isSegmentIntersectingNoFlyZone(point1: number[], point2: number[], center: number[], radius: number): boolean {
      return this.isPointInCircle(point1, center, radius) || 
            this.isPointInCircle(point2, center, radius);
  }

  animateFlight(): void {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }

    const totalSteps = 100;
    const duration = 60000;
    const stepDuration = duration / totalSteps;
  
    const moveFlight = () => {
      if (this.currentPositionIndex < this.flightPathCoordinates.length - 1) {
        let step = 0;
        const start = this.flightPathCoordinates[this.currentPositionIndex];
        const end = this.flightPathCoordinates[this.currentPositionIndex + 1];
  
        const interpolate = (t: number) => [
          start[0] + (end[0] - start[0]) * t,
          start[1] + (end[1] - start[1]) * t
        ];
  
        this.currentInterval = setInterval(() => {
          step++;
          if (step > totalSteps) {
            clearInterval(this.currentInterval);
            this.currentPositionIndex++;
            moveFlight();
          } else {
            const nextPosition = interpolate(step / totalSteps);
            this.flightFeature?.setGeometry(new Point(nextPosition));
            if (step % 5 === 0) {
              this.map?.getView().setCenter(nextPosition);
            }
          }
        }, stepDuration);
      }
    };
  
    moveFlight();
  }
}
