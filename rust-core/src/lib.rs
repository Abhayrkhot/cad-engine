use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

// Enable console.log for debugging
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
pub struct Vector {
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Polygon {
    pub vertices: Vec<Point>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Matrix {
    pub m11: f64,
    pub m12: f64,
    pub m21: f64,
    pub m22: f64,
    pub dx: f64,
    pub dy: f64,
}

impl Point {
    pub fn new(x: f64, y: f64) -> Point {
        Point { x, y }
    }
}

impl Vector {
    pub fn new(x: f64, y: f64) -> Vector {
        Vector { x, y }
    }
    
    pub fn magnitude(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }
    
    pub fn normalize(&self) -> Vector {
        let mag = self.magnitude();
        if mag == 0.0 {
            Vector::new(0.0, 0.0)
        } else {
            Vector::new(self.x / mag, self.y / mag)
        }
    }
}

impl Polygon {
    pub fn new(vertices: Vec<Point>) -> Polygon {
        Polygon { vertices }
    }
    
    pub fn area(&self) -> f64 {
        if self.vertices.len() < 3 {
            return 0.0;
        }
        
        let mut area = 0.0;
        let n = self.vertices.len();
        
        for i in 0..n {
            let j = (i + 1) % n;
            area += self.vertices[i].x * self.vertices[j].y;
            area -= self.vertices[j].x * self.vertices[i].y;
        }
        
        area.abs() / 2.0
    }
    
    pub fn perimeter(&self) -> f64 {
        if self.vertices.len() < 2 {
            return 0.0;
        }
        
        let mut perimeter = 0.0;
        let n = self.vertices.len();
        
        for i in 0..n {
            let j = (i + 1) % n;
            let dx = self.vertices[j].x - self.vertices[i].x;
            let dy = self.vertices[j].y - self.vertices[i].y;
            perimeter += (dx * dx + dy * dy).sqrt();
        }
        
        perimeter
    }
    
    pub fn centroid(&self) -> Point {
        if self.vertices.is_empty() {
            return Point::new(0.0, 0.0);
        }
        
        let mut cx = 0.0;
        let mut cy = 0.0;
        
        for vertex in &self.vertices {
            cx += vertex.x;
            cy += vertex.y;
        }
        
        Point::new(cx / self.vertices.len() as f64, cy / self.vertices.len() as f64)
    }
    
    pub fn transform(&self, matrix: &Matrix) -> Polygon {
        let mut new_vertices = Vec::new();
        
        for vertex in &self.vertices {
            let new_x = matrix.m11 * vertex.x + matrix.m12 * vertex.y + matrix.dx;
            let new_y = matrix.m21 * vertex.x + matrix.m22 * vertex.y + matrix.dy;
            new_vertices.push(Point::new(new_x, new_y));
        }
        
        Polygon::new(new_vertices)
    }
}

impl Matrix {
    pub fn identity() -> Matrix {
        Matrix {
            m11: 1.0, m12: 0.0,
            m21: 0.0, m22: 1.0,
            dx: 0.0, dy: 0.0,
        }
    }
    
    pub fn translate(dx: f64, dy: f64) -> Matrix {
        Matrix {
            m11: 1.0, m12: 0.0,
            m21: 0.0, m22: 1.0,
            dx, dy,
        }
    }
    
    pub fn scale(sx: f64, sy: f64) -> Matrix {
        Matrix {
            m11: sx, m12: 0.0,
            m21: 0.0, m22: sy,
            dx: 0.0, dy: 0.0,
        }
    }
    
    pub fn rotate(angle: f64) -> Matrix {
        let cos_a = angle.cos();
        let sin_a = angle.sin();
        Matrix {
            m11: cos_a, m12: -sin_a,
            m21: sin_a, m22: cos_a,
            dx: 0.0, dy: 0.0,
        }
    }
    
    pub fn multiply(&self, other: &Matrix) -> Matrix {
        Matrix {
            m11: self.m11 * other.m11 + self.m12 * other.m21,
            m12: self.m11 * other.m12 + self.m12 * other.m22,
            m21: self.m21 * other.m11 + self.m22 * other.m21,
            m22: self.m21 * other.m12 + self.m22 * other.m22,
            dx: self.m11 * other.dx + self.m12 * other.dy + self.dx,
            dy: self.m21 * other.dx + self.m22 * other.dy + self.dy,
        }
    }
}

// WASM bindings
#[wasm_bindgen]
impl Point {
    #[wasm_bindgen(constructor)]
    pub fn new_wasm(x: f64, y: f64) -> Point {
        Point::new(x, y)
    }
    
    #[wasm_bindgen(getter)]
    pub fn x(&self) -> f64 {
        self.x
    }
    
    #[wasm_bindgen(getter)]
    pub fn y(&self) -> f64 {
        self.y
    }
}

#[wasm_bindgen]
impl Vector {
    #[wasm_bindgen(constructor)]
    pub fn new_wasm(x: f64, y: f64) -> Vector {
        Vector::new(x, y)
    }
    
    #[wasm_bindgen(getter)]
    pub fn x(&self) -> f64 {
        self.x
    }
    
    #[wasm_bindgen(getter)]
    pub fn y(&self) -> f64 {
        self.y
    }
    
    #[wasm_bindgen]
    pub fn magnitude(&self) -> f64 {
        self.magnitude()
    }
    
    #[wasm_bindgen]
    pub fn normalize(&self) -> Vector {
        self.normalize()
    }
}

#[wasm_bindgen]
impl Polygon {
    #[wasm_bindgen(constructor)]
    pub fn new_wasm(vertices: &JsValue) -> Result<Polygon, JsValue> {
        let points: Vec<Point> = vertices.into_serde().map_err(|e| JsValue::from_str(&e.to_string()))?;
        Ok(Polygon::new(points))
    }
    
    #[wasm_bindgen]
    pub fn area(&self) -> f64 {
        self.area()
    }
    
    #[wasm_bindgen]
    pub fn perimeter(&self) -> f64 {
        self.perimeter()
    }
    
    #[wasm_bindgen]
    pub fn centroid(&self) -> Point {
        self.centroid()
    }
    
    #[wasm_bindgen]
    pub fn transform(&self, matrix: &Matrix) -> Polygon {
        self.transform(matrix)
    }
    
    #[wasm_bindgen]
    pub fn vertices(&self) -> JsValue {
        JsValue::from_serde(&self.vertices).unwrap()
    }
}

#[wasm_bindgen]
impl Matrix {
    #[wasm_bindgen(constructor)]
    pub fn new_wasm() -> Matrix {
        Matrix::identity()
    }
    
    #[wasm_bindgen]
    pub fn translate(dx: f64, dy: f64) -> Matrix {
        Matrix::translate(dx, dy)
    }
    
    #[wasm_bindgen]
    pub fn scale(sx: f64, sy: f64) -> Matrix {
        Matrix::scale(sx, sy)
    }
    
    #[wasm_bindgen]
    pub fn rotate(angle: f64) -> Matrix {
        Matrix::rotate(angle)
    }
    
    #[wasm_bindgen]
    pub fn multiply(&self, other: &Matrix) -> Matrix {
        self.multiply(other)
    }
}

// Convenience functions for direct WASM usage
#[wasm_bindgen]
pub fn create_square(size: f64) -> Polygon {
    let vertices = vec![
        Point::new(0.0, 0.0),
        Point::new(size, 0.0),
        Point::new(size, size),
        Point::new(0.0, size),
    ];
    Polygon::new(vertices)
}

#[wasm_bindgen]
pub fn create_triangle(base: f64, height: f64) -> Polygon {
    let vertices = vec![
        Point::new(0.0, 0.0),
        Point::new(base, 0.0),
        Point::new(base / 2.0, height),
    ];
    Polygon::new(vertices)
}

#[wasm_bindgen]
pub fn calculate_area(vertices: &JsValue) -> Result<f64, JsValue> {
    let points: Vec<Point> = vertices.into_serde().map_err(|e| JsValue::from_str(&e.to_string()))?;
    let polygon = Polygon::new(points);
    Ok(polygon.area())
}

#[wasm_bindgen]
pub fn calculate_perimeter(vertices: &JsValue) -> Result<f64, JsValue> {
    let points: Vec<Point> = vertices.into_serde().map_err(|e| JsValue::from_str(&e.to_string()))?;
    let polygon = Polygon::new(points);
    Ok(polygon.perimeter())
}

#[wasm_bindgen]
pub fn calculate_centroid(vertices: &JsValue) -> Result<Point, JsValue> {
    let points: Vec<Point> = vertices.into_serde().map_err(|e| JsValue::from_str(&e.to_string()))?;
    let polygon = Polygon::new(points);
    Ok(polygon.centroid())
}

#[wasm_bindgen]
pub fn transform_polygon(vertices: &JsValue, matrix: &Matrix) -> Result<JsValue, JsValue> {
    let points: Vec<Point> = vertices.into_serde().map_err(|e| JsValue::from_str(&e.to_string()))?;
    let polygon = Polygon::new(points);
    let transformed = polygon.transform(matrix);
    Ok(JsValue::from_serde(&transformed.vertices).unwrap())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_square_area() {
        let square = create_square(2.0);
        assert_eq!(square.area(), 4.0);
    }

    #[test]
    fn test_triangle_area() {
        let triangle = create_triangle(4.0, 3.0);
        assert_eq!(triangle.area(), 6.0);
    }

    #[test]
    fn test_perimeter() {
        let square = create_square(1.0);
        assert_eq!(square.perimeter(), 4.0);
    }

    #[test]
    fn test_centroid() {
        let square = create_square(2.0);
        let centroid = square.centroid();
        assert_eq!(centroid.x, 1.0);
        assert_eq!(centroid.y, 1.0);
    }

    #[test]
    fn test_transform() {
        let square = create_square(1.0);
        let matrix = Matrix::translate(2.0, 3.0);
        let transformed = square.transform(&matrix);
        let centroid = transformed.centroid();
        assert_eq!(centroid.x, 2.5);
        assert_eq!(centroid.y, 3.5);
    }
}
