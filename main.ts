
namespace SpriteKind {
    export const Playerhitbox = SpriteKind.create()
    export const Item = SpriteKind.create()
}
namespace NumArrayProp {
    export const NumResult = NumArrayProp.create()
}
namespace AnyProp {
    export const AnyResult = AnyProp.create()
}
function Create_player(Paper: Image, Player: number, Dir: number, Cursor: Image) {
    Playersprite = sprites.create(Paper, SpriteKind.Player)
    sprites.setDataBoolean(Playersprite, "St", false)
    sprites.setDataBoolean(Playersprite, "Di", false)
    sprites.setDataNumber(Playersprite, "Player", Player)
    sprites.setDataNumber(Playersprite, "P#", Player)
    sprites.setDataNumber(Playersprite, "Dir", Dir)
    sprites.setDataNumber(Playersprite, "E", 0)
    sprites.setDataNumber(Playersprite, "H", 5)
    sprites.setDataNumber(Playersprite, "A", 1)
    Player_rotation.push(scaling.createRotations(Playersprite.image, 4))
    Playersprite.setImage(Cursor)
    Playersprite.setFlag(SpriteFlag.Invisible, true)
    return Playersprite
}
function ResetGame(RestartGame: boolean) {
    StGame = false
    Start = false
    StartSetup = false
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Item)
    BeginSetup()
    InGame = true
    Render = false
    dir_frame = 0
    if (CurrentMaxPlayer) {
        Max_player = CurrentMaxPlayer
    }
    if (RestartGame) {
        select_maximum = true
        SelectTostart()
    }
    if (!(OpenMenu)) {
        StartGame()
    }
}
spriteutils.createRenderable(10, function (screen2) {
    if (!(StartSetup || Start)) {
        screen2.fillRect(0, 0, scene.screenWidth(), scene.screenHeight(), 15)
        if (!(select_maximum)) {
            images.printCenter(screen2, "Loading...", 56, 1)
        }
    }
})
function getLocationVal(locarr: tiles.Location[], col: number, row: number) {
    for (let locval of locarr) {
        if (locval.column == col && locval.row == row) return locarr
    } return undefined
}
function Check_overlap_in_setup(Chance: number) {
    PlacingItem = Item_sprite
    tiles.placeOnRandomTile(PlacingItem, assets.tile`myTile0`)
    let locv = PlacingItem.tilemapLocation()
    if (getLocationVal(LocationPlaced, locv.column, locv.row)) {
        while (getLocationVal(LocationPlaced, locv.column, locv.row)) {
            tiles.placeOnRandomTile(PlacingItem, assets.tile`myTile0`)
            locv = PlacingItem.tilemapLocation()
        }
    }
    LocationPlaced.push(PlacingItem.tilemapLocation())
}
function Ready(Player: Sprite) {
    if (Player.vx == 0 && Player.vy == 0) {
        return true
    }
    return false
}
function PlayersrpiteTick() {
    if (Playersprite == My_player) {
        Playersprite = spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
    }
    if (Playersprite) {
        if (!(Action)) {
            Get_player_acttacked(sprites.readDataNumber(My_player, "Dir"), true, sprites.readDataNumber(My_player, "A"), Playersprite, true)
            PlaySoundEffect(2)
            scene.cameraShake(4, 500)
            Action = true
        }
        if (Ready(Playersprite)) {
            if ((Playersprite && (sprites.readDataNumber(Playersprite, "H") > 0 || TileMapGridList[GetTiledAt(Playersprite.tilemapLocation().column, Playersprite.tilemapLocation().row)] >= 0)) && (My_player && sprites.readDataNumber(My_player, "E") > 0)) {
                NextTrun()
            }
            tiles.placeOnTile(Playersprite, Playersprite.tilemapLocation())
            if (sprites.readDataNumber(Playersprite, "H") <= 0 || TileMapGridList[GetTiledAt(Playersprite.tilemapLocation().column, Playersprite.tilemapLocation().row)] < 0) {
                extraEffects.createSpreadEffectOnAnchor(Playersprite, extraEffects.createSingleColorSpreadEffectData(ColorList[sprites.readDataNumber(Playersprite, "P#")], ExtraEffectPresetShape.Spark), 1000, 48, 20)
                if (TileMapGridList[GetTiledAt(Playersprite.tilemapLocation().column, Playersprite.tilemapLocation().row)] < 0) sprites.destroy(Playersprite, effects.bubbles, 500)
                else sprites.destroy(Playersprite)
                sprites.destroy(sprites.readDataSprite(Playersprite, "Hitbox"))
                Get_re_player_ID()
                PlaySoundEffect(3)
            }
            Action = false
            Playersprite = spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
        }
    }
}
function Get_Player_upgraded() {
    if (sprites.readDataString(Item_sprite, "Name") == "H") {
        sprites.changeDataNumberBy(My_player, "H", sprites.readDataNumber(Item_sprite, "Val"))
    } else if (sprites.readDataString(Item_sprite, "Name") == "E") {
        sprites.changeDataNumberBy(My_player, "E", sprites.readDataNumber(Item_sprite, "Val"))
    } else if (sprites.readDataString(Item_sprite, "Name") == "A") {
        sprites.changeDataNumberBy(My_player, "A", sprites.readDataNumber(Item_sprite, "Val"))
    }
    sprites.destroy(Item_sprite, effects.disintegrate, 500)
}
function GetMovePaticalAtSprite(Player: Sprite, dx: number, dy: number, Velocity: number, Delay: number) {
    timer.background(function () {
        PlayerPatical = extraEffects.createCustomSpreadEffectData(
            [ColorList[sprites.readDataNumber(Player, "P#")], 1],
            false,
            extraEffects.createShrinkingSizeTable(3),
            extraEffects.createPercentageRange(4, 8),
            extraEffects.createPercentageRange(6, 12),
            extraEffects.createTimeRange(Math.floor(Delay / 2), Delay)
        )
        PlayerPatical.extraVX = dx * Velocity
        PlayerPatical.extraVY = dy * Velocity
        extraEffects.createSpreadEffectOnAnchor(Player, PlayerPatical, Delay * 2.2, 48, 20)
    })
}
function NextTrun() {
    timer.background(function () {
        Trun = (Trun + 1) % Max_player
        My_player = New_trun(Trun, true)
        My_player.sayText(convertToText(sprites.readDataNumber(My_player, "E")), 500, false)
    })
}
function OptionPlayer(Dir: number, Dx: number, Dy: number) {
    if (My_player) {
        if (DragPlayer) {
            Player_location = MoveMyPlayerToPlace(Dx, Dy)
            return
        }
        if (TileMapGridList[GetTiledAt(Player_location.column + Dx, Player_location.row + Dy)] < 0) {
            return
        }
        sprites.setDataNumber(My_player, "Dir", Dir)
        My_player.setImage(Player_rotation[sprites.readDataNumber(My_player, "P#")][sprites.readDataNumber(My_player, "Dir") - 1])
        Pidx += 1
        if (Pidx >= Max_player) {
            SetupTrun(true)
            StartSetup = false
            Start = true
            StGame = true
            return
        }
        GotPlayerSetup()
        return
    }
}
function RandomToSort(Player: Sprite) {
    DiceVal = randint(1, 6)
    Pidx = PlayerDiceStart.length - 1
    while (DiceVal >= PlayerDiceStart[Pidx]) {
        Pidx += -1
        if (Pidx <= 0) {
            break;
        }
    }
    while (DiceVal < PlayerDiceStart[Pidx]) {
        Pidx += 1
        if (Pidx >= PlayerDiceStart.length) {
            break;
        }
    }
    PlayerDiceStart.insertAt(Pidx, DiceVal)
    PlayerDice.insertAt(Pidx, sprites.readDataNumber(Player, "P#"))
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(InGame)) {
        ResetGame(false)
    } else {
        if (!(Start)) {
            PlacePlayer()
        }
    }
})
function CreateMenu(MenuItem: any[], Header: string, Option: number[], Result: any[], Frame: Image) {
    MenuSprite = miniMenu.createMenuFromArray(MenuItem)
    MenuSprite.setFrame(Frame)
    MenuSprite.setTitle(Header)
    MenuSprite.setDimensions(Option[0], Option[1])
    MenuSprite.setPosition(Option[2], Option[3])
    MenuSprite.z = Option[4]
    blockObject.storeOnSprite(blockObject.create(), MenuSprite)
    blockObject.setNumberArrayProperty(MenuSprite, NumArrayProp.NumResult, Result)
    return MenuSprite
}
function TextStateUpdate() {
    if (StartSetup || Start) {
        Str = ""
        for (let value2 of PlayerDice) {
            for (let value of sprites.allOfKind(SpriteKind.Player)) {
                if (value2 == sprites.readDataNumber(value, "P#")) {
                    if (sprites.readDataBoolean(value, "Placed")) {
                        Colour = ColorList[sprites.readDataNumber(value, "P#")]
                        Str = "" + Str + ("Player" + convertToText(sprites.readDataNumber(value, "P#") + 1))
                        if (Start && (My_player && value == My_player)) {
                            Str = "" + Str + " !"
                        }
                        if (Start) {
                            Str = "" + Str + " \\n " + ("H:" + convertToText(sprites.readDataNumber(value, "H")) + " D:" + convertToText(sprites.readDataNumber(value, "A")) + " E:" + convertToText(sprites.readDataNumber(value, "E")))
                        } else {
                            Str = "" + Str + " \\n " + ("Dice:" + convertToText(PlayerDiceStart[PlayerDice.indexOf(value2)]))
                        }
                        Str = "" + Str + " \\n "
                    }
                }
            }
        }
        fancyText.setText(TextNameSprite, Str)
        TextNameSprite.left = 0
        TextNameSprite.top = 0
    }
}
function Setup_asset() {
    Map_asset = [
        assets.tile`myTile31`,
        assets.tile`myTile32`,
        assets.tile`myTile33`,
        assets.tile`myTile34`,
        assets.tile`myTile35`,
        assets.tile`myTile36`,
        assets.tile`myTile37`,
        assets.tile`myTile38`,
        assets.tile`myTile39`,
        assets.tile`myTile40`,
        assets.tile`myTile41`,
        assets.tile`myTile42`,
        assets.tile`myTile43`,
        assets.tile`myTile44`,
        assets.tile`myTile45`,
        assets.tile`myTile46`
    ]
    MapRecipe = [
        "0000",
        "0110",
        "0111",
        "0011",
        "0010",
        "1110",
        "1111",
        "1011",
        "1010",
        "1100",
        "1101",
        "1001",
        "1000",
        "0100",
        "0101",
        "0001"
    ]
    MapGroup = []
    for (let index2 = 0; index2 < Map_asset.length; index2++) {
        MapGroup.push(1)
    }
}
function FixTileAt(Idx: number) {
    Tile = TileMapGridList[Idx]
    if (Tile < 0) {
        return
    }
    TileGP = MapGroup[Tile]
    if (TileGP <= 0) {
        return
    }
    Recipe = ""
    Build_Recipe(Idx - MapCol)
    Build_Recipe(Idx + 1)
    Build_Recipe(Idx + MapCol)
    Build_Recipe(Idx - 1)
    for (let index = 0; index <= MapGroup.length - 1; index++) {
        if (MapGroup[index] == TileGP) {
            if (MapRecipe[index] == Recipe) {
                TileMapGridList[Idx] = index
                return
            }
        }
    }
}
function TextUpdate() {
    fancyText.setColor(TextNameSprite, 1)
}
function MyPlayerTick() {
    if (My_player) {
        My_player.setImage(Player_rotation[sprites.readDataNumber(My_player, "P#")][sprites.readDataNumber(My_player, "Dir") - 1])
        if (Ready(My_player)) {
            tiles.placeOnTile(My_player, My_player.tilemapLocation())
            if (!(sprites.readDataBoolean(My_player, "St")) && Get_stucked(My_player)) {
                sprites.setDataNumber(My_player, "E", 0)
                sprites.setDataBoolean(My_player, "St", true)
            }
            if (sprites.readDataNumber(My_player, "E") <= 0) {
                Item_sprite = Get_item_on_tile(My_player.tilemapLocation().column, My_player.tilemapLocation().row)
                if (Item_sprite) {
                    Get_Player_upgraded()
                    PlaySoundEffect(1)
                }
                if (GetPlayed) {
                    sprites.setDataBoolean(My_player, "HasPlay", true)
                }
                if (!(Playersprite)) {
                    GetPlayed = true
                    Playersprite = Get_touching_on(My_player)
                    if (Playersprite) {
                        GetPlayed = false
                    }
                }
                if (GetPlayed) {
                    NextTrun()
                }
            }
        } else {
            sprites.setDataBoolean(My_player, "St", false)
        }
    }
}
function Get_player_on_trun(Trun: number) {
    for (let value of sprites.allOfKind(SpriteKind.Player)) {
        if (PlayerDice[Trun] == sprites.readDataNumber(value, "P#")) {
            return value
        }
    }
    return spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
}
function Get_touching_on(Player: Sprite) {
    Player_location = Player.tilemapLocation()
    if (sprites.readDataNumber(Player, "Dir") == 1) {
        return Get_player_on_tile(Player_location.column + 1, Player_location.row)
    } else if (sprites.readDataNumber(Player, "Dir") == 2) {
        return Get_player_on_tile(Player_location.column, Player_location.row + 1)
    } else if (sprites.readDataNumber(Player, "Dir") == 3) {
        return Get_player_on_tile(Player_location.column - 1, Player_location.row)
    } else {
        return Get_player_on_tile(Player_location.column, Player_location.row - 1)
    }
    return spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
}
function LeaderBoardCapture(Player: Sprite, InsertBegin: boolean, PlayerId: number) {
    if (LeaderBoardList.indexOf(sprites.readDataNumber(Player, "P#")) >= 0) {
        return
    }
    if (InsertBegin) {
        LeaderBoardList.unshift(sprites.readDataNumber(Player, "P#"))
        return
    }
    LeaderBoardList.push(sprites.readDataNumber(Player, "P#"))
}
function GetMovement(Dir: number, UTrun: number) {
    if (Ready(My_player)) {
        if (sprites.readDataNumber(My_player, "Dir") != UTrun) {
            sprites.setDataNumber(My_player, "Dir", Dir)
            if (Can_i_move_here(My_player)) {
                Walk_in_direction(sprites.readDataNumber(My_player, "Dir"), true, true)
                My_player.sayText(convertToText(sprites.readDataNumber(My_player, "E")), 500, false)
                PlaySoundEffect(0)
            }
        } else {
            if (Can_i_Utrun_here(My_player)) {
                sprites.setDataNumber(My_player, "Dir", Dir)
                Walk_in_direction(sprites.readDataNumber(My_player, "Dir"), false, true)
                PlaySoundEffect(4)
            }
        }
    }
}
function PlacePlayerInSetup(Chance: number) {
    PlacingPlayer = Playersprite
    tiles.placeOnRandomTile(PlacingPlayer, assets.tile`myTile0`)
    let locv = PlacingPlayer.tilemapLocation()
    if (getLocationVal(LocationPlaced, locv.column, locv.row)) {
        while (getLocationVal(LocationPlaced, locv.column, locv.row)) {
            tiles.placeOnRandomTile(PlacingPlayer, assets.tile`myTile0`)
            locv = PlacingPlayer.tilemapLocation()
        }
    }
    LocationPlaced.push(PlacingPlayer.tilemapLocation())
}
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    if (InGame) {
        J = PlayerDice.indexOf(sprites.readDataNumber(sprite, "P#"))
        PlayerDice.removeAt(J)
        PlayerDiceStart.removeAt(J)
        if (Start) {
            let PlayerKilledList: number[] = []
            if (sprites.allOfKind(SpriteKind.Player).length <= 1) {
                Trun = sprites.allOfKind(SpriteKind.Player).length - 1
                My_player = Get_player_on_trun(Trun)
                LeaderBoardCapture(My_player, true, 1)
            } else {

            }
            timer.after(50, function () {
                LeaderBoardCapture(sprite, PlayerKilledList.indexOf(sprites.readDataNumber(sprite, "P#")) >= 0, 1)
            })
            if (My_player) {
                if (!(sprites.readDataBoolean(My_player, "HasPlay"))) {
                    if (LeaderBoardColorList.indexOf(8) < 0) {
                        LeaderBoardColorList.unshift(8)
                    }
                }
                PlayerKilledList.push(sprites.readDataNumber(My_player, "P#"))
                GetPlayed = true
            }
            if (Playersprite) {
                Playersprite = undefined
            }
            if (sprites.allOfKind(SpriteKind.Player).length == 1) {
                timer.after(1000, function () {
                    color.startFadeFromCurrent(color.White, 500)
                    timer.after(500, function () {
                        StGame = false
                        WinIntro = true
                        InGame = false
                        timer.after(500, function () {
                            color.startFadeFromCurrent(color.originalPalette, 500)
                            timer.after(500, function () {
                                color.clearFadeEffect()
                            })
                        })
                    })
                })
            } else if (sprites.allOfKind(SpriteKind.Player).length > 1) {
                NextTrun()
            }
        }
    }
})
function New_trun(Trun: number, Play: boolean) {
    Playersprite = Get_player_on_trun(Trun)
    if (Play) {
        sprites.changeDataNumberBy(Playersprite, "E", randint(1, 6))
        Max_energy = sprites.readDataNumber(Playersprite, "E")
    }
    return Playersprite
}
function Build_Recipe(EdgeIdx: number) {
    EdgeTile = TileMapGridList[EdgeIdx]
    if (TileGP == MapGroup[EdgeTile]) {
        Recipe = "" + Recipe + "1"
    } else {
        Recipe = "" + Recipe + "0"
    }
}
function Get_item_on_tile(Col: number, Row: number) {
    for (let value of sprites.allOfKind(SpriteKind.Item)) {
        if (Col == value.tilemapLocation().column && Row == value.tilemapLocation().row) {
            return value
        }
    }
    return spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
}
function Get_player_acttacked(Dir: number, Touching: boolean, Damage: number, Player: Sprite, Effect: boolean) {
    if (Get_touching_on(My_player)) {
        Player.fx = 30
        Player.fy = 30
        Player.vx = MovePin[0][Dir - 1] * Math.sqrt(2 * (My_player.fx * 8))
        Player.vy = MovePin[1][Dir - 1] * Math.sqrt(2 * (My_player.fx * 8))
        if (Effect) {
            GetMovePaticalAtSprite(Player, 0 - MovePin[0][Dir - 1], 0 - MovePin[1][Dir - 1], 80, 500)
        }
        extraEffects.createSpreadEffectOnAnchor(Player, extraEffects.createSingleColorSpreadEffectData(ColorList[sprites.readDataNumber(Player, "P#")], ExtraEffectPresetShape.Spark), 500, 48)
        sprites.changeDataNumberBy(Player, "H", 0 - Damage)
    }
}
function TimeToFixTile(Idx: number) {
    FixTileAt(Idx)
    FixTileAt(Idx + 1)
    FixTileAt(Idx + MapCol)
    FixTileAt(Idx - 1)
    FixTileAt(Idx - MapCol)
}
function Walk_in_direction(Dir: number, Walk: boolean, Effect: boolean) {
    if (!(Walk)) {
        sprites.setDataNumber(My_player, "E", 0)
    } else {
        My_player.fx = 30
        My_player.fy = 30
        My_player.vx = MovePin[0][Dir - 1] * Math.sqrt(2 * (My_player.fx * 8))
        My_player.vy = MovePin[1][Dir - 1] * Math.sqrt(2 * (My_player.fx * 8))
        if (Effect) {
            GetMovePaticalAtSprite(My_player, 0 - MovePin[0][Dir - 1], 0 - MovePin[1][Dir - 1], 80, 500)
        }
        sprites.changeDataNumberBy(My_player, "E", -1)
    }
}
function RenderTile() {
    for (let index = 0; index <= MapCol * MapRow - 1; index++) {
        if (TileMapGridList[index] < 0) {
            tiles.setTileAt(tiles.getTileLocation(OffCol + index % MapCol, OffRow + Math.floor(index / MapCol)), TileHole[Math.abs(TileMapGridList[index]) - 1])
        } else {
            TimeToFixTile(index)
            tiles.setTileAt(tiles.getTileLocation(OffCol + index % MapCol, OffRow + Math.floor(index / MapCol)), Map_asset[TileMapGridList[index]])
        }
    }
    for (let locval of tiles.getTilesByType(TileHole[0])) tiles.setTileAt(locval, img`
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
        . . . . . . . .
    `)
}
function PlaySoundEffect(SoundID: number) {
    SoundList = [
        music.createSoundEffect(
            WaveShape.Square,
            869,
            2801,
            255,
            0,
            162,
            SoundExpressionEffect.None,
            InterpolationCurve.Logarithmic
        ),
        music.createSoundEffect(
            WaveShape.Sawtooth,
            305,
            186,
            255,
            0,
            450,
            SoundExpressionEffect.None,
            InterpolationCurve.Curve
        ),
        music.createSoundEffect(
            WaveShape.Noise,
            2385,
            602,
            255,
            0,
            550,
            SoundExpressionEffect.None,
            InterpolationCurve.Curve
        ),
        music.createSoundEffect(
            WaveShape.Noise,
            570,
            565,
            255,
            0,
            800,
            SoundExpressionEffect.None,
            InterpolationCurve.Linear
        ),
        music.createSoundEffect(
            WaveShape.Square,
            1910,
            631,
            255,
            0,
            162,
            SoundExpressionEffect.None,
            InterpolationCurve.Curve
        )
    ]
    music.play(SoundList[SoundID], music.PlaybackMode.InBackground)
}
function Create_item(Image2: Image, Name: string, Value: number) {
    Item_sprite = sprites.create(Image2, SpriteKind.Item)
    sprites.setDataString(Item_sprite, "Name", Name)
    sprites.setDataNumber(Item_sprite, "Val", Value)
    return Item_sprite
}
function CantIplaceHere(Col: number, Row: number) {
    if (Get_player_on_tile(Col, Row)) {
        if (sprites.readDataBoolean(Get_player_on_tile(Col, Row), "Placed")) {
            return false
        }
    }
    if (Get_item_on_tile(Col, Row)) {
        return false
    }
    return true
}
function BeginSetup() {
    LeaderBoardRankList = [
        "1st",
        "2nd",
        "3rd",
        "4th"
    ]
    PlayerIconList = [
        img`
            1 1 1 1 1 1 1 1 1 1
            1 2 2 2 2 2 2 2 2 1
            1 2 2 2 2 2 2 2 2 1
            1 2 2 2 2 2 2 2 2 1
            1 2 2 2 2 2 1 1 2 1
            1 2 2 2 2 2 1 1 2 1
            1 2 2 2 2 2 2 2 2 1
            1 2 2 2 2 2 2 2 2 1
            1 2 2 2 2 2 2 2 2 1
            1 1 1 1 1 1 1 1 1 1
        `,
        img`
            1 1 1 1 1 1 1 1 1 1
            1 8 8 8 8 8 8 8 8 1
            1 8 8 8 8 8 8 8 8 1
            1 8 8 8 8 8 8 8 8 1
            1 8 8 8 8 8 1 1 8 1
            1 8 8 8 8 8 1 1 8 1
            1 8 8 8 8 8 8 8 8 1
            1 8 8 8 8 8 8 8 8 1
            1 8 8 8 8 8 8 8 8 1
            1 1 1 1 1 1 1 1 1 1
        `,
        img`
            1 1 1 1 1 1 1 1 1 1
            1 4 4 4 4 4 4 4 4 1
            1 4 4 4 4 4 4 4 4 1
            1 4 4 4 4 4 4 4 4 1
            1 4 4 4 4 4 1 1 4 1
            1 4 4 4 4 4 1 1 4 1
            1 4 4 4 4 4 4 4 4 1
            1 4 4 4 4 4 4 4 4 1
            1 4 4 4 4 4 4 4 4 1
            1 1 1 1 1 1 1 1 1 1
        `,
        img`
            1 1 1 1 1 1 1 1 1 1
            1 6 6 6 6 6 6 6 6 1
            1 6 6 6 6 6 6 6 6 1
            1 6 6 6 6 6 6 6 6 1
            1 6 6 6 6 6 1 1 6 1
            1 6 6 6 6 6 1 1 6 1
            1 6 6 6 6 6 6 6 6 1
            1 6 6 6 6 6 6 6 6 1
            1 6 6 6 6 6 6 6 6 1
            1 1 1 1 1 1 1 1 1 1
        `
    ]
    LeaderBoardColorList = [
        4,
        13,
        14,
        12
    ]
    LeaderBoardList = []
    LeaderBoardList = []
    LocationPlaced = []
    ColorList = [
        2,
        8,
        4,
        6
    ]
    MovePin = [[
        1,
        0,
        -1,
        0
    ], [
        0,
        1,
        0,
        -1
    ]]
    ColorFrameList = [
        img`
            . c c c c .
            c c 2 2 c c
            c 2 2 2 2 c
            c 2 2 2 2 c
            c c 2 2 c c
            . c c c c .
        `,
        img`
            . 8 8 8 8 .
            8 8 6 6 8 8
            8 6 6 6 6 8
            8 6 6 6 6 8
            8 8 6 6 8 8
            . 8 8 8 8 .
        `,
        img`
            . e e e e .
            e e 4 4 e e
            e 4 4 4 4 e
            e 4 4 4 4 e
            e e 4 4 e e
            . e e e e .
        `,
        img`
            . 6 6 6 6 .
            6 6 7 7 6 6
            6 7 7 7 7 6
            6 7 7 7 7 6
            6 6 7 7 6 6
            . 6 6 6 6 .
        `
    ]
    TileHole = [assets.tile`myTile`, assets.tile`myTile49`]
}
function SetupTrun(Normal: boolean) {
    if (My_player) {
        My_player = spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
    }
    if (Normal) {
        Trun = 0
    } else {
        Trun = randint(0, Max_player - 1)
    }
    My_player = New_trun(Trun, true)
    My_player.sayText(convertToText(sprites.readDataNumber(My_player, "E")), 500, false)
}
function Can_i_move_here(Asker: Sprite) {
    Player_location = Asker.tilemapLocation()
    if (sprites.readDataNumber(Asker, "Dir") == 1 && TileMapGridList[GetTiledAt(Player_location.column + 1, Player_location.row + 0)] < 0) {
        return false
    }
    if (sprites.readDataNumber(Asker, "Dir") == 2 && TileMapGridList[GetTiledAt(Player_location.column + 0, Player_location.row + 1)] < 0) {
        return false
    }
    if (sprites.readDataNumber(Asker, "Dir") == 3 && TileMapGridList[GetTiledAt(Player_location.column - 1, Player_location.row - 0)] < 0) {
        return false
    }
    if (sprites.readDataNumber(Asker, "Dir") == 4 && TileMapGridList[GetTiledAt(Player_location.column - 0, Player_location.row - 1)] < 0) {
        return false
    }
    return true
}
function SelectTostart() {
    if (!(OpenMenu)) {
        MenuSelect = CreateMenu([
            miniMenu.createMenuItem("2Players", assets.image`myImage3`),
            miniMenu.createMenuItem("3Players", assets.image`myImage4`),
            miniMenu.createMenuItem("4Players", assets.image`myImage5`)
        ], "HowManyPlayers?", [
            122,
            78,
            80,
            60,
            15
        ], [2, 3, 4], img`
            ..................
            ..................
            ..33333333333333..
            ..31111111111113b.
            ..31333333333313bc
            ..31311111111313bc
            ..31311111111313bc
            ..31311111111313bc
            ..31311111111313bc
            ..31311111111313bc
            ..31311111111313bc
            ..31311111111313bc
            ..31311111111313bc
            ..31333333333313bc
            ..31111111111113bc
            ..33333333333333bc
            ...bbbbbbbbbbbbbbc
            ....cccccccccccccc
        `)
        blockObject.storeOnSprite(blockObject.getStoredObject(MenuSprite), MenuSelect)
        OpenMenu = true
        MenuSelect.onButtonPressed(controller.A, function (selection, selectedIndex) {
            MenuSelect.close()
            Max_player = blockObject.getNumberArrayProperty(MenuSelect, NumArrayProp.NumResult)[selectedIndex]
            CurrentMaxPlayer = Max_player
            OpenMenu = false
            StartGame()
        })
    }
}
function RenderStatus(Width: number, SliceHight: number, HighlightControl: boolean) {
    Img = image.create(Width, scene.screenHeight())
    index = 0
    spriteutils.drawTransparentImage(image.screenImage(), Img, 0, 0)
    for (let value2 of PlayerDice) {
        for (let value of sprites.allOfKind(SpriteKind.Player)) {
            if (value2 == sprites.readDataNumber(value, "P#")) {
                if (sprites.readDataBoolean(value, "Placed")) {
                    Img.fillRect(0, index * SliceHight, Width, SliceHight, ColorList[sprites.readDataNumber(value, "P#")])
                    Img.fillRect(0, (index + 1) * SliceHight - 1, Width, 1, 1)
                    spriteutils.drawTransparentImage(scaling.createRotations(img`
                        1 1 1 1 1 1 1 1 1 1 
                        1 . . . . . . . . 1 
                        1 . . . . . . . . 1 
                        1 . . . . . . . . 1 
                        1 . . . . . 1 1 . 1 
                        1 . . . . . 1 1 . 1 
                        1 . . . . . . . . 1 
                        1 . . . . . . . . 1 
                        1 . . . . . . . . 1 
                        1 1 1 1 1 1 1 1 1 1 
                        `, 4)[sprites.readDataNumber(value, "Dir") - 1], Img, Width - 16, index * SliceHight + (SliceHight / 2 - 9))
                }
            }
        }
        index += 1
    }
    if (HighlightControl) {
        Img.fillRect(0, scene.screenHeight() - 35, Width, 35, ColorList[sprites.readDataNumber(My_player, "P#")])
        if (StartSetup) {
            if (!(TextStateSprite)) {
                TextStateSprite = fancyText.create("abc")
                fancyText.setColor(TextStateSprite, 1)
                fancyText.setMaxWidth(TextStateSprite, 72)
                fancyText.setFont(TextStateSprite, fancyText.geometric_serif_6)
                TextStateSprite.setPosition(72 / 2, scene.screenHeight() - 27)
                TextStateSprite.z = 11
            }
            if (TextStateSprite) {
                if (DragPlayer) {
                    fancyText.setText(TextStateSprite, "MoveAnd \\n Place \\n ThePlayer")
                } else {
                    fancyText.setText(TextStateSprite, "SetDirection \\n AndWait \\n ToStart")
                }
            }
        } else {
            if (Start) {
                if (TextStateSprite) {
                    sprites.destroy(TextStateSprite)
                    TextStateSprite = spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
                }
            }
            if (My_player) {
                if (Ready(My_player)) {
                    for (let index = 0; index <= 3; index++) {
                        if (index == ((sprites.readDataNumber(My_player, "Dir") - 1) % 4 + 2) % 4) {
                            if (Can_i_Utrun_here(My_player)) {
                                spriteutils.drawTransparentImage(scaling.createRotations(img`
                                    ..............................
                                    ..............................
                                    ..............................
                                    ............111111............
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ....1111111........1111111....
                                    ...1......................1...
                                    ...1..................11..1...
                                    ...1.................1..1.1...
                                    ...1.................1..1.1...
                                    ...1..................11..1...
                                    ...1......................1...
                                    ....1111111........1111111....
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ............111111............
                                    ..............................
                                    ..............................
                                    ..............................
                                    `, 4)[index], Img, 0, scene.screenHeight() - 35)
                            }
                        } else {
                            if (index == sprites.readDataNumber(My_player, "Dir") - 1) {
                                if (Can_i_move_here(My_player)) {
                                    spriteutils.drawTransparentImage(scaling.createRotations(img`
                                        ..............................
                                        ..............................
                                        ..............................
                                        ............111111............
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ....1111111........1111111....
                                        ...1......................1...
                                        ...1..................11..1...
                                        ...1.................1111.1...
                                        ...1.................1111.1...
                                        ...1..................11..1...
                                        ...1......................1...
                                        ....1111111........1111111....
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ...........1......1...........
                                        ............111111............
                                        ..............................
                                        ..............................
                                        ..............................
                                        `, 4)[index], Img, 0, scene.screenHeight() - 35)
                                }
                            } else if (tiles.readDataNumber(tiles.getTileLocation(My_player.tilemapLocation().column + MovePin[0][index], My_player.tilemapLocation().row + MovePin[1][index]), "Tdata") >= 0) {
                                spriteutils.drawTransparentImage(scaling.createRotations(img`
                                    ..............................
                                    ..............................
                                    ..............................
                                    ............111111............
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ....1111111........1111111....
                                    ...1......................1...
                                    ...1..................11..1...
                                    ...1.................1111.1...
                                    ...1.................1111.1...
                                    ...1..................11..1...
                                    ...1......................1...
                                    ....1111111........1111111....
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ...........1......1...........
                                    ............111111............
                                    ..............................
                                    ..............................
                                    ..............................
                                    `, 4)[index], Img, 0, scene.screenHeight() - 35)
                            }
                        }
                    }
                }
                spriteutils.drawTransparentImage(scaling.createRotations(img`
                    ..............................
                    ..............................
                    ..............................
                    ............111111............
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ....1111111........11111111...
                    ...1......................11..
                    ...1......................111.
                    ...1......................1111
                    ...1......................1111
                    ...1......................111.
                    ...1......................11..
                    ....1111111........11111111...
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ...........1......1...........
                    ............111111............
                    ..............................
                    ..............................
                    ..............................
                    `, 4)[sprites.readDataNumber(My_player, "Dir") - 1], Img, 0, scene.screenHeight() - 35)
            }
        }
        Img.fillRect(0, scene.screenHeight() - 35, Width, 1, 1)
    }
    Img.fillRect(Width - 1, 0, 1, scene.screenHeight(), 1)
    return Img
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Start) {
        GetMovement(1, 3)
    } else if (StartSetup) {
        OptionPlayer(1, 1, 0)
    }
})
function Get_stucked(Asker: Sprite) {
    Player_location = Asker.tilemapLocation()
    if (sprites.readDataNumber(Asker, "Dir") == 1) {
        if (FindStucked([[1, 0], [0, -1], [0, 1]])) {
            return true
        }
    }
    if (sprites.readDataNumber(Asker, "Dir") == 2) {
        if (FindStucked([[0, 1], [-1, 0], [1, 0]])) {
            return true
        }
    }
    if (sprites.readDataNumber(Asker, "Dir") == 3) {
        if (FindStucked([[-1, 0], [0, -1], [0, 1]])) {
            return true
        }
    }
    if (sprites.readDataNumber(Asker, "Dir") == 4) {
        if (FindStucked([[0, -1], [-1, 0], [1, 0]])) {
            return true
        }
    }
    return false
}
function GotPlayerSetup() {
    My_player = New_trun(Pidx, false)
    My_player.setFlag(SpriteFlag.Invisible, false)
    Player_location = My_player.tilemapLocation()
    DragPlayer = true
}
function Get_overlaps(Player: Sprite) {
    for (let value of sprites.allOfKind(SpriteKind.Player)) {
        if (Player.overlapsWith(value)) {
            return value
        }
    }
    return spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(InGame)) {
        ResetGame(true)
    }
})
spriteutils.createRenderable(20, function (screen2) {
    if (!(InGame)) {
        screen2.fillRect(0, 0, scene.screenWidth(), scene.screenHeight(), 15)
        screen2.fillRect(0, scene.screenHeight() - 22, scene.screenWidth(), 1, 1)
        images.print(screen2, "A To Rematch", 62, scene.screenHeight() - 20, 1)
        images.print(screen2, "B To Restart", 62, scene.screenHeight() - 10, 1)
        if (My_player) {
            images.print(screen2, "Player" + convertToText(sprites.readDataNumber(My_player, "P#") + 1) + "WIN!", 70, 40, 1)
        }
        index = 0
        screen2.fillRect(0, 0, 60, scene.screenHeight(), 11)
        screen2.fillRect(60, 0, 1, scene.screenHeight(), 1)
        for (let value of LeaderBoardRankList) {
            if (index < LeaderBoardList.length) {
                Img = image.create(60, 20)
                Img.fill(LeaderBoardColorList[index])
                Img.drawRect(-1, -1, 62, 21, 1)
                spriteutils.drawTransparentImage(PlayerIconList[LeaderBoardList[index]], Img, 5, 5)
                images.print(Img, value, 16, 6, 1)
                spriteutils.drawTransparentImage(Img, screen2, 0, index * 20)
            }
            index += 1
        }
    }
})
function MoveMyPlayerToPlace(Dx: number, Dy: number) {
    if (TileMapGridList[GetTiledAt(Player_location.column + Dx, Player_location.row + Dy)] < 0) {
        return Player_location
    }
    tiles.placeOnTile(My_player, tiles.getTileLocation(Player_location.column + Dx, Player_location.row + Dy))
    return tiles.getTileLocation(Player_location.column + Dx, Player_location.row + Dy)
}
function Generate_new_map(Width: number, Hight: number, OffsetCol: number, OffsetRow: number, Count: number, Max: number) {
    I = 0
    while (I <= Max) {
        for (let value of tiles.getTilesByType(assets.tile`myTile1`)) {
            tiles.setTileAt(value, assets.tile`myTile0`)
        }
        for (let value2 of tiles.getTilesByType(assets.tile`myTile0`)) {
            if (Math.percentChance(randint(50, 90))) {
                Tile_gen = randint(0, 3)
                if (Tile_gen == 0) {
                    if (value2.column < OffsetCol + Width) {
                        tiles.setTileAt(value2.getNeighboringLocation(CollisionDirection.Right), assets.tile`myTile1`)
                    }
                } else if (Tile_gen == 1) {
                    if (value2.row < OffsetRow + Hight) {
                        tiles.setTileAt(value2.getNeighboringLocation(CollisionDirection.Bottom), assets.tile`myTile1`)
                    }
                } else if (Tile_gen == 2) {
                    if (value2.column > OffsetCol) {
                        tiles.setTileAt(value2.getNeighboringLocation(CollisionDirection.Left), assets.tile`myTile1`)
                    }
                } else {
                    if (value2.row > OffsetRow) {
                        tiles.setTileAt(value2.getNeighboringLocation(CollisionDirection.Top), assets.tile`myTile1`)
                    }
                }
            }
        }
        I += 1
    }
    for (let value3 of tiles.getTilesByType(assets.tile`myTile1`)) {
        tiles.setTileAt(value3, assets.tile`myTile0`)
    }
    OffCol = OffsetCol - 1
    OffRow = OffsetRow - 1
    MapCol = Width + 3
    MapRow = Hight + 3
}
function TextSetup() {
    TextNameSprite = fancyText.create("", 80)
    TextNameSprite.left = 0
    TextNameSprite.top = 0
    fancyText.setFont(TextNameSprite, fancyText.geometric_serif_7)
    TextNameSprite.z = 1
    TextNameSprite.setFlag(SpriteFlag.RelativeToCamera, true)
}
spriteutils.createRenderable(1, function (screen2) {
    if (StartSetup || Start) {
        screen2.fillRect(0, 0, 80, scene.screenHeight(), 15)
        spriteutils.drawTransparentImage(RenderStatus(80, 20, true), screen2, 0, 0)
    }
})
function Get_player_on_tile(Col: number, Row: number) {
    for (let value of sprites.allOfKind(SpriteKind.Player)) {
        if (Col == value.tilemapLocation().column && Row == value.tilemapLocation().row) {
            return value
        }
    }
    return spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
}
function StartGame() {
    scene.setBackgroundColor(9)
    scene.setBackgroundImage(img`
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
        ................................................................................................................................................................................................................................................................................................................................
    `)
    select_maximum = false
    pauseUntil(() => !(controller.anyButton.isPressed()))
    pause(100)
    tiles.loadMap(tiles.createSmallMap(tilemap`level4`))
    TileMapFrame = 0
    Generate_new_map(5, 9, 12, 2, 1, randint(12, 15))
    Action = false
    PlayerImage = [[
        assets.image`myImage0`,
        assets.image`myImage1`,
        assets.image`myImage2`,
        assets.image`myImage`
    ], [
        img`
        2 2 2 2 2 2 2 2 2 2 
        2 . . . . . . . . 2 
        2 . . . . . . . . 2 
        2 . . . . . . . . 2 
        2 . . . 2 2 . . . 2 
        2 . . . 2 2 . . . 2 
        2 . . . . . . . . 2 
        2 . . . . . . . . 2 
        2 . . . . . . . . 2 
        2 2 2 2 2 2 2 2 2 2 
        `,
        img`
        8 8 8 8 8 8 8 8 8 8 
        8 . . . . . . . . 8 
        8 . . . . . . . . 8 
        8 . . . . . . . . 8 
        8 . . . 8 8 . . . 8 
        8 . . . 8 8 . . . 8 
        8 . . . . . . . . 8 
        8 . . . . . . . . 8 
        8 . . . . . . . . 8 
        8 8 8 8 8 8 8 8 8 8 
        `,
        img`
        4 4 4 4 4 4 4 4 4 4 
        4 . . . . . . . . 4 
        4 . . . . . . . . 4 
        4 . . . . . . . . 4 
        4 . . . 4 4 . . . 4 
        4 . . . 4 4 . . . 4 
        4 . . . . . . . . 4 
        4 . . . . . . . . 4 
        4 . . . . . . . . 4 
        4 4 4 4 4 4 4 4 4 4 
        `,
        img`
        6 6 6 6 6 6 6 6 6 6 
        6 . . . . . . . . 6 
        6 . . . . . . . . 6 
        6 . . . . . . . . 6 
        6 . . . 6 6 . . . 6 
        6 . . . 6 6 . . . 6 
        6 . . . . . . . . 6 
        6 . . . . . . . . 6 
        6 . . . . . . . . 6 
        6 6 6 6 6 6 6 6 6 6 
        `
    ]]
    Player_rotation = []
    Hitbox_rotation = []
    PlayerDiceStart = [999999]
    PlayerDice = [-1]
    Pidx = 0
    Setup_item()
    for (let index = 0; index <= Max_player - 1; index++) {
        tiles.placeOnRandomTile(Create_player(PlayerImage[0][index], index, randint(1, 4), PlayerImage[1][index]), assets.tile`myTile0`)
        PlacePlayerInSetup(10)
        RandomToSort(Playersprite)
    }
    PlayerDiceStart.removeAt(0)
    PlayerDice.removeAt(0)
    Ground_setup()
    Playersprite = spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
    StartSetup = true
    TextSetup()
    TextUpdate()
    Pidx = 0
    GotPlayerSetup()
}
function GetTiledAt(col: number, row: number) {
    gx = col - OffCol
    gy = row - OffRow
    gidx = gx
    gidx += gy * MapCol
    return gidx
}
function PlacePlayer() {
    if (DragPlayer) {
        if (CantIplaceHere(Player_location.column, Player_location.row)) {
            My_player.setImage(Player_rotation[sprites.readDataNumber(My_player, "P#")][sprites.readDataNumber(My_player, "Dir") - 1])
            sprites.setDataBoolean(My_player, "Placed", true)
            tiles.placeOnTile(My_player, Player_location)
            DragPlayer = false
        }
    }
}
function Ground_setup() {
    Setup_asset()
    for (let value3 of tiles.getTilesByType(assets.tile`myTile`)) {
        tiles.setDataNumber(value3, "Tdata", -1)
    }
    for (let value3 of tiles.getTilesByType(assets.tile`myTile0`)) {
        tiles.setDataNumber(value3, "Tdata", 1)
    }
    for (let value3 of tiles.getTilesByType(assets.tile`myTile`)) {
        if (tiles.tileAtLocationEquals(value3.getNeighboringLocation(CollisionDirection.Top), assets.tile`myTile0`)) {
            tiles.setTileAt(value3, assets.tile`myTile49`)
        }
    }
    TileMapGridList = []
    for (let J = 0; J <= MapCol - 1; J++) {
        TileMapGridList.push(-1)
    }
    for (let I = 0; I <= MapRow - 3; I++) {
        TileMapGridList.push(-1)
        for (let J = 0; J <= MapCol - 3; J++) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(OffCol + 1 + J, OffRow + 1 + I), assets.tile`myTile0`)) {
                TileMapGridList.push(0)
            } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(OffCol + 1 + J, OffRow + 1 + I), assets.tile`myTile`)) {
                TileMapGridList.push(-1)
            } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(OffCol + 1 + J, OffRow + 1 + I), assets.tile`myTile49`)) {
                TileMapGridList.push(-2)
            }
        }
        TileMapGridList.push(-1)
    }
    for (let J = 0; J <= MapCol - 1; J++) {
        if (tiles.tileAtLocationEquals(tiles.getTileLocation(OffCol + J, OffRow + (MapRow - 1)), assets.tile`myTile49`)) {
            TileMapGridList.push(-2)
        } else {
            TileMapGridList.push(-1)
        }
    }
    for (let value3 of tiles.getTilesByType(assets.tile`myTile0`)) {
        tiles.setTileAt(value3, assets.tile`myTile31`)
    }
    RenderTile()
    Render = true
}
function Setup_item() {
    for (let index2 = 0; index2 < randint(2, 5); index2++) {
        tiles.placeOnRandomTile(Create_item(assets.image`myImage6`, "A", 1), assets.tile`myTile0`)
        Check_overlap_in_setup(5)
    }
    for (let index2 = 0; index2 < randint(2, 5); index2++) {
        tiles.placeOnRandomTile(Create_item(assets.image`myImage7`, "H", 1), assets.tile`myTile0`)
        Check_overlap_in_setup(5)
    }
    for (let index2 = 0; index2 < randint(2, 5); index2++) {
        tiles.placeOnRandomTile(Create_item(assets.image`myImage8`, "E", 2), assets.tile`myTile0`)
        Check_overlap_in_setup(5)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Start) {
        GetMovement(3, 1)
    } else if (StartSetup) {
        OptionPlayer(3, -1, 0)
    }
})
function FindStucked(DxDyTemp: number[][]) {
    Count = 0
    for (let value of DxDyTemp) {
        if (TileMapGridList[GetTiledAt(Player_location.column + value[0], Player_location.row + value[1])] < 0) {
            Count += 1
        }
    }
    if (Count >= DxDyTemp.length) {
        return true
    }
    return false
}
function Can_i_Utrun_here(Asker: Sprite) {
    if (sprites.readDataNumber(Asker, "E") == Max_energy) {
        return true
    }
    return false
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Start) {
        GetMovement(4, 2)
    } else if (StartSetup) {
        OptionPlayer(4, 0, -1)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Start) {
        GetMovement(2, 4)
    } else if (StartSetup) {
        OptionPlayer(2, 0, 1)
    }
})
function Get_re_player_ID() {
    index = 0
    for (let value of sprites.allOfKind(SpriteKind.Player)) {
        sprites.setDataNumber(value, "Player", index)
        sprites.setDataNumber(sprites.readDataSprite(value, "Hitbox"), "Player", index)
        index += 1
    }
    Max_player += -1
    Trun = Trun % Max_player
    My_player = New_trun(Trun, true)
}
let Count = 0
let gidx = 0
let gy = 0
let gx = 0
let Hitbox_rotation: number[] = []
let PlayerImage: Image[][] = []
let TileMapFrame = 0
let Tile_gen = 0
let I = 0
let TextStateSprite: fancyText.TextSprite = null
let index = 0
let Img: Image = null
let MenuSelect: miniMenu.MenuSprite = null
let ColorFrameList: Image[] = []
let PlayerIconList: Image[] = []
let LeaderBoardRankList: string[] = []
let SoundList: music.SoundEffect[] = []
let OffRow = 0
let OffCol = 0
let TileHole: Image[] = []
let MapRow = 0
let MovePin: number[][] = []
let EdgeTile = 0
let Max_energy = 0
let WinIntro = false
let LeaderBoardColorList: number[] = []
let J = 0
let PlacingPlayer: Sprite = null
let LeaderBoardList: number[] = []
let GetPlayed = false
let MapCol = 0
let Recipe = ""
let TileGP = 0
let Tile = 0
let MapGroup: number[] = []
let MapRecipe: string[] = []
let Map_asset: Image[] = []
let TextNameSprite: fancyText.TextSprite = null
let Colour = 0
let Str = ""
let MenuSprite: miniMenu.MenuSprite = null
let PlayerDice: number[] = []
let PlayerDiceStart: number[] = []
let DiceVal = 0
let Pidx = 0
let Player_location: tiles.Location = null
let DragPlayer = false
let Trun = 0
let PlayerPatical: SpreadEffectData = null
let ColorList: number[] = []
let TileMapGridList: number[] = []
let Action = false
let My_player: Sprite = null
let LocationPlaced: tiles.Location[] = []
let Item_sprite: Sprite = null
let PlacingItem: Sprite = null
let OpenMenu = false
let select_maximum = false
let Max_player = 0
let CurrentMaxPlayer = 0
let dir_frame = 0
let Render = false
let InGame = false
let StartSetup = false
let Start = false
let StGame = false
let Player_rotation: Image[][] = []
let Playersprite: Sprite = null
ResetGame(true)
game.onUpdate(function () {
    if (InGame) {
        if (Start) {
            MyPlayerTick()
            PlayersrpiteTick()
        }
    }
})
basic.forever(function () {
    if (scene.backgroundImage()) {
        scene.backgroundImage().scroll(-(1), 0)
        if (Math.floor(game.runtime() / 10) % 2 == 0 && (randint(0, 7) == 0)) {
            scene.backgroundImage().fillRect(scene.screenWidth(), randint(0, scene.screenHeight() - 1), randint(1, 4) * 3, 1, 1)
        }
    }
})
game.onUpdate(function () {
    if (InGame) {
        if (StartSetup == Start) {
            if (TextNameSprite) {
                sprites.destroy(TextNameSprite)
                TextNameSprite = spriteutils.nullConsts(spriteutils.NullConsts.Undefined)
            }
        }
        if (TextNameSprite) {
            TextNameSprite.left = 0
            TextNameSprite.top = 0
            TextStateUpdate()
        }
    }
})

