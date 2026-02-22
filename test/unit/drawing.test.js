import { expect, test } from 'vitest'
import Canvas from '../../src/Canvas.js'

test('drawPixel works correctly with integer coordinates', () => {
    // TODO need to abstract way the real canvas from Canvas class. Use adapters, so you can implement
    // - RayTracer -> DrawingPort
    // - Renderer -> DrawingPort
    // - DrawingPort -> MockDrowingAdapter for tests
    // - DrawingPort -> DOMDrawingAdapter for DOM canvas
    // - DrawingPort -> RayLibDrawingAdapter for native canvas using raylib backend

    ////// Port
    //export interface DrawingPort {
    // drawPixel()
    // drawLine()
    // drawTriangle()
    // ...
    //}
    //
    //// Core
    //export class RayTracer {
    //  constructor(private canvas: DrawingPort) {}
    //}
    //// Core
    //export class Renderer {
    //  constructor(private canvas: DrawingPort) {}
    //}
    //
    //// Adapters
    //export class MockDrowingAdapter implements DrawingPort {}
    //export class DOMDrawingAdapter implements DrawingPort {}
    //export class RayLibDrawingAdapter implements DrawingPort {}
})
