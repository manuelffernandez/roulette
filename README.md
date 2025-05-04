# Estrategia de apuestas para la Ruleta Europea

Estrategia de apuestas para ruleta europea basado en un sistema de puntajes acumulativos. El objetivo es generar y gestionar una lista completa de eventos para apuestas simples.

El jugador selecciona los eventos simples en los que desea apostar, y cada vez que sale un número que no corresponde a esos eventos, se les asigna un punto. A partir de un umbral de tolerancia al riesgo configurado por el jugador, el sistema evalúa cuándo conviene realizar una apuesta y emite una sugerencia.

Por ejemplo, si se selecciona apostar a "negro" con un umbral de 3, y han salido 4 números consecutivos "rojos", el evento "negro" acumula 4 puntos. Al superar el umbral establecido, el sistema recomienda apostar a "negro", interpretando que podría ser un buen momento estratégico.

Es importante aclarar que la premisa sobre la cual se sostiene el desarrollo de esta estrategia es matemáticamente incorrecta. Un evento que no ha salido durante mucho tiempo no es más probable que salga. Esto se debe a que los eventos son independientes: la probabilidad de que ocurra en una ronda determinada no está condicionada por los resultados de rondas anteriores.

## Funcionamiento

Dado que el objetivo principal de este proyecto es registrar estadísticas de los resultados, el juego actualmente solo permite apuestas automatizadas. Es decir, una vez ejecutado el programa con el comando npm run dev, las partidas se inician y finalizan de forma automática, generando únicamente logs en la terminal.

Algunos parámetros son configurables a través de los objetos que se pasan a los constructores, lo cual se detalla más adelante en este documento.

### Definición de Eventos Simples

Un evento simple es un grupo de números pertenecientes a la ruleta al cual se le puede realizar una apuesta en una sola ronda desde una única posición.

Por ejemplo, el grupo de números **_{3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36}_** es un evento simple, ya que se puede apostar a todo ese grupo mediante la posicion **1ra docena**. Por el contrario el grupo **_{5, 32}_** no lo es, ya que la única forma de apostar a esos numeros es apostando a dos posiciones distintas **pleno 5 y pleno 32**.

En total hay una cantidad de 154 eventos simples.

**Propiedades de los eventos:**

- **id:** Identificador único de cada evento. Tipo string.
- **type:** Identificador de los tipos distintos de apuestas: color, alto/bajo, par/impar, docena, columna, linea, calle, esquina, dividido, pleno. Tipo string.
- **group:** Grupo del tablero al que pertenece el evento: afuera o adentro. Tipo string ("outside" | "inside")
- **values:** Lista de números de la ruleta que pertenecen al evento. Tipo array.
- **payout:** Coeficiente por el que multiplica la apuesta en caso de ganar. Tipo number.

### Algoritmo

- El jugador selecciona de una lista completa de eventos simples los eventos a los que quiere seguir, por ejemplo: "negro", "par", "calle uno". Ademas define una apuesta base (baseStake) que es el monto inicial de cada apuesta. .
  Opcional el jugador puede definir el umbral de puntos a superar para que el sistema sugiera a partir de ese valor.

- Por cada tirada:

  - Si el número no pertenece a un evento seleccionado, ese evento suma +1 punto.

  - Si el número pertenece a un evento, su contador se resetea a 0.

  - Si el número es cero, el contador de los eventos de grupo "outside" vuelve a 0.

- Cuando uno o más eventos superan el umbral de puntaje definido, el sistema sugiere apostar a esos eventos, bajo la lógica de que "ya deberían salir".

- Se mantiene un registro de las apuestas realizadas en la útlima ronda y en base al sistema de apuestas elegido (por ahora solo martingala), se devuelven sugerencias de eventos con sus respectivos montos a apostar (systemBets). Estas sugerencias se complementan las sugerencias devueltas por la estrategia de contar puntos (proableBets)

### Configuración

A continuación se detallan las clases principales y los parámetros que reciben en sus constructores.

#### Strategy

```typescript
new Strategy(config: StrategyConfig)
```

`StrategyConfig`:

- `targetEvents: Array<EventId> | "all"`
  Lista de eventos simples (como rojo, negro, par, impar, etc.) a los que se les hará seguimiento. También puede pasarse "all" para incluir todos los eventos disponibles.

- `betSystem: BetSystem`
  Tipo de sistema de apuestas a utilizar. Actualmente solo se encuentra implementado el sistema Martingala.

- `baseStake: number`
  Monto base de las apuestas sugeridas por probableBets. También se utiliza para calcular los montos en las apuestas sistemáticas (systemBets).

- `gameRecord?: Array<No>`
  (Opcional) Historial de jugadas. Este campo está reservado para futuras implementaciones donde se permita comenzar una estrategia en una partida ya iniciada. Actualmente no tiene uso.

#### Player

```typescript
new Player(config: PlayerConfig)
```

`PlayerConfig`:

- `name: string`
  Nombre del jugador.

- `logs?: boolean`
  (Opcional) Indica si se deben mostrar en consola los logs generados por las acciones del jugador.

- `bankroll: number`
  Monto de dinero inicial disponible para el jugador.

- `strategy: StrategyConfig`
  Estrategia que seguirá el jugador. Se pasa el mismo objeto que se utiliza para instanciar la clase `Strategy`.

#### Game

```typescript
new Game(player: Player, config: GameConfig)
```

`GameConfig`:

- `logs: boolean`
  Determina si se deben mostrar los logs en consola durante la ejecución de la partida.

- `useSeed: boolean`
  Si es `true`, se utilizará una seed para generar una secuencia predecible de números aleatorios (útil para pruebas o simulaciones reproducibles).

- `seed?: string`
  (Opcional) Valor de la seed que se pasará a la función `seedrandom`. Si `useSeed` es `false`, este campo se ignora.

## Instalación

Para ejecutar este proyecto localmente, hay que tener instalado Node.js.

### Instalación de dependencias

Ejecutá el siguiente comando en la raíz del proyecto para instalar todas las dependencias necesarias:

```bash
npm install
```

### Ejecución del proyecto

Una vez instaladas las dependencias, podés iniciar el programa con:

```bash
npm run dev
```

## Links de interés

- [Link del libro de la ruleta con la mayor cantidad de paginas que conseguí](https://books.google.com.py/books?id=yOhB9TaH-vwC&printsec=frontcover#v=onepage&q&f=false)

- [Demostracion serie geometrica](<https://espanol.libretexts.org/Matematicas/Analisis/Variables_complejas_con_aplicaciones_(Orloff)/08%3A_Serie_Taylor_y_Laurent/8.01%3A_Serie_Geom%C3%A9trica>)
