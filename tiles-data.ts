const locationDataDict: { [locationKey: string]: { [key: string]: any } } = {};

namespace tiles {

    function getLocationKey(location: tiles.Location): string {
        return `${location.col},${location.row}`;
    }

    function getDataForLocation(location: tiles.Location, key: string): any {
        const locationKey = getLocationKey(location);
        const data = locationDataDict[locationKey];
        return data ? data[key] : undefined;
    }

    function setDataForLocation(location: tiles.Location, key: string, value: any): void {
        const locationKey = getLocationKey(location);
        if (!locationDataDict[locationKey]) {
            locationDataDict[locationKey] = {};
        }
        locationDataDict[locationKey][key] = value;
    }

    function getSpritesAtLocation(location: tiles.Location): Sprite[] {
        const locationKey = getLocationKey(location);
        const data = locationDataDict[locationKey];
        const spritesAtLocation: Sprite[] = [];
        if (data) {
            Object.keys(data).forEach(key => {
                const value = data[key];
                if (value instanceof Sprite) {
                    spritesAtLocation.push(value);
                }
            });
        }
        return spritesAtLocation;
    }




    /**
     * Sets a sprite in the data of a tile
     */
    //% blockId=tileDataSetSprite block="set $location $key to sprite $value=variables_get(mySprite)"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=13
    //% blockGap=8
    export function setDataSprite(location: tiles.Location, key: string, value: Sprite): void {
        setDataForLocation(location, key, value);
    }

    /**
     * Gets a sprite in the data of a tile
     */
    //% blockId=tileDataGetSprite block="$location data $key as sprite"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=12
    //% blockGap=8
    export function readDataSprite(location: tiles.Location, key: string): Sprite | undefined {
        return getDataForLocation(location, key) as Sprite;
    }

    /**
     * Sets a boolean in the data of a tile
     */
    //% blockId=tileDataSetBoolean block="set $location $key to boolean $value"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=11
    //% blockGap=8
    export function setDataBoolean(location: tiles.Location, key: string, value: boolean): void {
        setDataForLocation(location, key, value);
    }

    /**
     * Gets a boolean in the data of a tile
     */
    //% blockId=tileDataGetBoolean block="$location data $key as boolean"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function readDataBoolean(location: tiles.Location, key: string): boolean {
        return getDataForLocation(location, key) as boolean || false;
    }

    /**
     * Sets a string in the data of a tile
     */
    //% blockId=tileDataSetString block="set $location $key to string $value"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=9
    //% blockGap=8
    export function setDataString(location: tiles.Location, key: string, value: string): void {
        setDataForLocation(location, key, value);
    }

    /**
     * Gets a string in the data of a tile
     */
    //% blockId=tileDataGetString block="$location data $key as string"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=8
    //% blockGap=8
    export function readDataString(location: tiles.Location, key: string): string {
        return getDataForLocation(location, key) as string || "";
    }

    /**
     * Sets a number in the data of a tile
     */
    //% blockId=tileDataSetNumber block="set $location $key to number $value"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=7
    //% blockGap=8
    export function setDataNumber(location: tiles.Location, key: string, value: number): void {
        setDataForLocation(location, key, value);
    }

    /**
     * Changes a number in the data of a tile
     */
    //% blockId=tileDataChangeNumber block="change $location $key data by $value"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=6
    //% blockGap=8
    export function changeDataNumber(location: tiles.Location, key: string, value: number): void {
        let currentValue = readDataNumber(location, key);
        setDataForLocation(location, key, currentValue + value);
    }

    /**
     * Gets a number in the data of a tile
     */
    //% blockId=tileDataGetNumber block="$location data $key as number"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=5
    //% blockGap=8
    export function readDataNumber(location: tiles.Location, key: string): number {
        return getDataForLocation(location, key) as number || 0;
    }

    /**
     * Sets an image in the data of a tile
     */
    //% blockId=tileDataSetImage block="set $location $key to image $value"
    //% location.shadow=mapgettile
    //% value.shadow=screen_image_picker
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=4
    //% blockGap=8
    export function setDataImage(location: tiles.Location, key: string, value: Image): void {
        setDataForLocation(location, key, value);
    }

    /**
     * Gets an image in the data of a tile
     */
    //% blockId=tileDataGetImage block="$location data $key as image"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=3
    //% blockGap=8
    export function readDataImage(location: tiles.Location, key: string): Image | undefined {
        return getDataForLocation(location, key) as Image;
    }

    /**
     * Move stored data from one tile to another
     */
    //% blockId=tileDataMove block="move data from $originalLocation to $newLocation || moving attached sprites $moveSprites"
    //% originalLocation.shadow=mapgettile
    //% newLocation.shadow=mapgettile
    //% expandableArgumentMode="toggle"
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=2
    //% blockGap=8
    export function moveData(originalLocation: tiles.Location, newLocation: tiles.Location, moveStoredSprites: boolean = false): void {
        const originalKey = getLocationKey(originalLocation);
        const newKey = getLocationKey(newLocation);
        locationDataDict[newKey] = locationDataDict[originalKey];
        delete locationDataDict[originalKey];
        if (moveStoredSprites) {
            getSpritesAtLocation(newLocation).forEach((sprite: Sprite) => {
                tiles.placeOnTile(sprite, newLocation)
            })
        }
    }

    /**
     * Cleanse the data of a tile
     */
    //% blockId=tileDataCleanse block="cleanse $location data"
    //% location.shadow=mapgettile
    //% blockNamespace=scene color="#401255"
    //% group="Data"
    //% weight=1
    //% blockGap=8
    export function cleanseData(location: tiles.Location): void {
        const locationKey = getLocationKey(location);
        delete locationDataDict[locationKey];
    }
}