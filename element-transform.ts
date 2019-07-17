interface ElementTransformProperty {
  title: string;
  value: string;
}

export class ElementTransform {
  properties: ElementTransformProperty[] = [];

  toString() {
    return this.properties.map((property: ElementTransformProperty) =>
      property.value
    ).join(' ');
  }

  set rotate(deg: number) {
    const property = this.getProperty('rotate');
    if (property) {
      this.setProperty('rotate', `rotate(${deg}deg)`);
    } else {
      this.properties.push({
        title: 'rotate',
        value: `rotate(${deg}deg)`
      })
    }
  }

  set moveZ(z: number) {
    const title = 'moveZ';
    const value = `perspective(100px) translateZ(${z}px)`;
    const property = this.getProperty(title);
    if (property) {
      this.setProperty(title, value);
    } else {
      this.properties.push({ title, value })
    }
  }

  private getProperty(title: string) {
    return this.properties.filter((property: ElementTransformProperty) =>
      property.title === title
    ).reduce((acc, curr) => curr, null);
  }

  private setProperty(title: string, value: string) {
    this.properties = this.properties.map((property) =>
      property.title === title ? { title, value } : property
    );
  }
}