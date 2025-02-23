# SkyguardianFrontend

# SkyGuardian Logic

## Route Definition and Initialization

- The program defines multiple flight routes using geographic coordinates (e.g., coastal, central valley, eastern, hybrid). Each route is broken into segments represented by coordinate points.
- A map is initialized using OpenLayers, displaying base layers with OpenStreetMap tiles. The active route and a flight marker (representing the aircraft) are drawn.

## Flight Simulation Logic

- startFlightSimulation() triggers the flight by initializing the map, creating interactive route-switching buttons, and starting the animation.
- The animateFlight() function smoothly moves the flight marker along the route by interpolating between points, updating the aircraft’s position, and keeping the map centered on the marker during flight.

## Dynamic Rerouting System

- addNoFlyZone() visually adds a no-fly zone on the map and immediately checks for route conflicts.
- findAlternativeRoute() scans available routes to identify those that avoid the no-fly zone using the helper method routeIntersectsNoFlyZone(), which detects whether any segment intersects with restricted airspace.

## Real-time Conflict Detection

- The program uses geometric checks (isPointInCircle()) to determine if any part of the route enters a circular no-fly zone. If a conflict is found, it automatically suggests a safer alternative route.

## User Interaction and Visualization

- Buttons for switching between routes are dynamically generated with distinct colors for clarity.
- showAllRoutes() displays all potential flight paths simultaneously, allowing users to visually compare routes in relation to no-fly zones.

## Safety-First Prioritization

- During the flight, the system continuously monitors route segments for conflicts, ensuring that the simulation dynamically adapts to changes in airspace restrictions in real time.

## SkyGuradian Run Instructions

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


