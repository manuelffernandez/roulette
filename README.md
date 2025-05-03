# Sistema de apuestas para la Ruleta Europea

Sistema de apuestas para ruleta europea basado en un sistema de puntajes acumulativos. El objetivo es generar y gestionar una lista completa de eventos para apuestas simples: color (rojo/negro), alto/bajo, par/impar, columnas, docenas, calles, líneas, esquinas, divididas y plenos.

El jugador selecciona los eventos simples en los que desea apostar, y cada vez que sale un número que no corresponde a esos eventos, se les asigna un punto. A partir de un umbral de tolerancia al riesgo configurado por el jugador, el sistema evalúa cuándo conviene realizar una apuesta y emite una sugerencia.

Por ejemplo, si se selecciona apostar a "negro" con un umbral de 3, y han salido 4 números consecutivos "rojos", el evento "negro" acumula 4 puntos. Al superar el umbral establecido, el sistema recomienda apostar a "negro", interpretando que podría ser un buen momento estratégico.

## Funcionamiento

### Eventos Simples

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

- El jugador selecciona de una lista completa de eventos simples los eventos a los que quiere seguir, por ejemplo: "negro", "par", "calle uno".
  Opcional el jugador puede definir el umbral de puntos a superar para que el sistema sugiera a partir de ese valor.

- Por cada tirada:

  - Si el número no pertenece a un evento seleccionado, ese evento suma +1 punto.

  - Si el número pertenece a un evento, su contador se resetea a 0.

  - Si el número es cero, el contador de los eventos marcados como

- Cuando uno o más eventos superan el umbral de puntaje definido, el sistema sugiere apostar a esos eventos, bajo la lógica de que "ya deberían salir".

## Links de interés

- [Link del libro de la ruleta con la mayor cantidad de paginas que conseguí](https://books.google.com.py/books?id=yOhB9TaH-vwC&printsec=frontcover#v=onepage&q&f=false)

- [Demostracion serie geometrica](<https://espanol.libretexts.org/Matematicas/Analisis/Variables_complejas_con_aplicaciones_(Orloff)/08%3A_Serie_Taylor_y_Laurent/8.01%3A_Serie_Geom%C3%A9trica>)
