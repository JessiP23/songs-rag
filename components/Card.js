import { Card, Grid, Text, Button, Row } from "@nextui-org/react";

export default function Card() {
    return (
        <Grid.Container gap={2}>
            <Grid sm={12} md={5}>
                <Card css={{ mw: '330px' }}>
                    <Card.Header>
                        <Text b></Text>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body css={{ py: '$10' }}>
                        <Text>
                            DEscription
                        </Text>
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer>
                        <Row justify="flex-end">
                            <Button size="sm" light>
                                Cancel
                            </Button>
                            <Button size="sm">Agree</Button>
                        </Row>
                    </Card.Footer>
                </Card>
            </Grid>
        </Grid.Container>
    )
}