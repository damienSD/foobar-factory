# Description

Foobar factory is a experimental project act as a proof of skills (python, node, react, docker)

# requirements

- Linux OS : centOS >= 8, or debian >= 9, or ubuntu >= 12 
- docker [https://docs.docker.com/engine/install/] version >= 20.10.9
- bash (Script Shell Interpreter) version >= 5.0.17

# Rules

## Le but est de coder une chaîne de production automatique de foobar

On dispose au départ de 2 robots, mais on souhaite accélérer la production pour
prendre le contrôle du marché des foobar . Pour ce faire on va devoir acheter
davantage de robots, le programme s'arrête quand on a 30 robots.

## Les robots sont chacun capables d'effectuer les activités suivantes :
- Miner du foo : occupe le robot pendant 1 seconde.
- Miner du bar : occupe le robot pendant un temps aléatoire compris entre 0.5
et 2 secondes.
- Assembler un foobar à partir d'un foo et d'un bar : occupe le robot pendant 2
secondes. L'opération a 60% de chances de succès ; en cas d'échec le bar
peut être réutilisé, le foo est perdu.
- Vendre des foobar : 10s pour vendre de 1 à 5 foobar, on gagne 1€ par foobar
vendu
- Acheter un nouveau robot pour 3€ et 6 foo , 0s

A chaque changement de type d'activité, le robot doit se déplacer à un nouveau
poste de travail, cela l'occupe pendant 5s.

# Getting started 

```bash
git clone https://github.com/damienSD/foobar-factory.git foobar-factory
cd foobar-factory/
./do dev
# for the developpement stack, that give more verbosity in standard ouput and nextJS dev mode
# you can also ./do start but typescript compilation will failed for now
```
You can tweek the time factor and the fooBar price

```bash
# Make the process 3x faster
SPEED_FACTOR=3 ./do dev 
# Make the foobar price half decrease
FOOBAR_PRICE=0.5 ./do dev
# Both parameters for extra speed
SPEED_FACTOR=10 FOOBAR_PRICE=3 ./do dev
```


Open a browser at http://127.0.0.1:8000/ to get control of the Factory
Check "Start production" on the switch button

# Architecture explanation

## This project is based on docker and engage 
- Python for the factory and robot workers
- Node for the frondend and the redis API
- Redis as the storage backend (states, stocks, credits, foos, bars, counters)

## Compositions
- The factory and the nextJS front are launched together on the same network
- The factory create 2 robots and the redis containers
- Each robot are autonomous and in-container
- Each actors share/subscribe informations through redis
- The factory is started by button click event
- Each robot and factory loop frames at startup
- As soon as possible a new robot is bought and a new container is pulled out
- 30 Robots == victory


# In DEV commands

```bash
./do clean
./do black
./do tests
```
